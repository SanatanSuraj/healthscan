import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

export interface AccessJwtPayload {
  sub: string;
  tv: number;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        config.get<string>('JWT_ACCESS_SECRET') ?? 'healthscan-dev-access',
    });
  }

  async validate(payload: AccessJwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    if ((user as { refreshTokenVersion?: number }).refreshTokenVersion !== payload.tv) {
      throw new UnauthorizedException();
    }
    return {
      userId: payload.sub,
      roles: payload.roles,
      isGuest: user.isGuest,
    };
  }
}
