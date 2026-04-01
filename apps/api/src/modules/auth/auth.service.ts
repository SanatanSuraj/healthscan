import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { ProfilesService } from '../profiles/profiles.service';
import { RedisService } from '../redis/redis.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { AccessJwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  /** Fallback when REDIS_URL not set (dev only). */
  private readonly otpMemory = new Map<
    string,
    { code: string; exp: number }
  >();

  constructor(
    private readonly users: UsersService,
    private readonly profiles: ProfilesService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {}

  private get accessSecret() {
    return this.config.get<string>('JWT_ACCESS_SECRET') ?? 'healthscan-dev-access';
  }

  private get refreshSecret() {
    return (
      this.config.get<string>('JWT_REFRESH_SECRET') ?? 'healthscan-dev-refresh'
    );
  }

  async register(dto: RegisterDto) {
    const user = await this.users.createRegisteredUser(dto.email, dto.password);
    await this.profiles.ensureProfile(user._id.toString());
    return this.issueTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmailWithSecret(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await this.users.validatePassword(user, dto.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync<{
        sub: string;
        tv: number;
      }>(refreshToken, { secret: this.refreshSecret });
      const user = await this.users.findById(payload.sub);
      if (!user || user.refreshTokenVersion !== payload.tv) {
        throw new UnauthorizedException();
      }
      return this.issueTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.users.bumpRefreshVersion(userId);
    return { ok: true };
  }

  async sendOtp(phone: string) {
    const code = (100000 + Math.floor(Math.random() * 900000)).toString();
    const key = `otp:${phone}`;
    const client = this.redis.getClient();
    if (client) await client.setex(key, 300, code);
    else {
      this.otpMemory.set(phone, { code, exp: Date.now() + 300_000 });
    }
    const isDev = this.config.get('NODE_ENV') !== 'production';
    return isDev ? { sent: true, devCode: code } : { sent: true };
  }

  async verifyOtp(phone: string, code: string) {
    const key = `otp:${phone}`;
    let stored = await this.redis.get(key);
    if (!stored) {
      const mem = this.otpMemory.get(phone);
      if (mem && mem.exp > Date.now()) stored = mem.code;
    }
    if (!stored || stored !== code) {
      throw new UnauthorizedException('Invalid or expired code');
    }
    if (this.redis.getClient()) await this.redis.del(key);
    else this.otpMemory.delete(phone);

    let user = await this.users.findByPhone(phone);
    if (!user) {
      user = await this.users.createPhoneUser(phone);
      await this.profiles.ensureProfile(user._id.toString());
    }
    return this.issueTokens(user);
  }

  private async issueTokens(user: {
    _id: unknown;
    email?: string;
    roles: string[];
    refreshTokenVersion: number;
  }) {
    const sub = String(user._id);
    const tv = user.refreshTokenVersion;
    const accessPayload: AccessJwtPayload = {
      sub,
      tv,
      roles: user.roles,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(accessPayload, {
        secret: this.accessSecret,
        expiresIn: '15m',
      }),
      this.jwt.signAsync({ sub, tv }, {
        secret: this.refreshSecret,
        expiresIn: '7d',
      }),
    ]);
    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 900,
      userId: sub,
    };
  }
}
