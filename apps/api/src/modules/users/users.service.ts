import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async createPhoneUser(phone: string): Promise<UserDocument> {
    return this.userModel.create({
      phone,
      roles: ['user'],
      isGuest: false,
    });
  }

  async findByEmailWithSecret(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).select('+passwordHash').exec();
  }

  async createRegisteredUser(
    email: string,
    password: string,
  ): Promise<UserDocument> {
    const existing = await this.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await argon2.hash(password);
    return this.userModel.create({
      email: email.toLowerCase(),
      passwordHash,
      roles: ['user'],
      isGuest: false,
    });
  }

  async createGuestUser(): Promise<UserDocument> {
    return this.userModel.create({
      roles: ['user'],
      isGuest: true,
      guestScreeningUsed: false,
    });
  }

  async validatePassword(
    user: UserDocument,
    password: string,
  ): Promise<boolean> {
    if (!user.passwordHash) return false;
    return argon2.verify(user.passwordHash, password);
  }

  async bumpRefreshVersion(userId: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { $inc: { refreshTokenVersion: 1 } },
    );
  }

  async markGuestUsed(userId: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { guestScreeningUsed: true },
    );
  }

  async requestDeletion(userId: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { deletionRequestedAt: new Date() },
    );
  }
}
