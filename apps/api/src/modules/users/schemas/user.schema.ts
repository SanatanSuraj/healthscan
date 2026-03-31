import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ sparse: true, unique: true, lowercase: true, trim: true })
  email?: string;

  @Prop({ sparse: true, unique: true, trim: true })
  phone?: string;

  @Prop({ select: false })
  passwordHash?: string;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];

  @Prop({ default: false })
  isGuest: boolean;

  /** PRD: one free guest module attempt */
  @Prop({ default: false })
  guestScreeningUsed: boolean;

  @Prop({ default: 0 })
  refreshTokenVersion: number;

  @Prop()
  deletionRequestedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ createdAt: -1 });
