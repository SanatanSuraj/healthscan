import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProfileDocument = Profile & mongoose.Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ trim: true })
  displayName?: string;

  @Prop()
  age?: number;

  @Prop()
  gender?: string;

  @Prop()
  occupation?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  medicalHistory: Record<string, unknown>;

  @Prop()
  consentVersion?: string;

  @Prop()
  consentAcceptedAt?: Date;

  @Prop({
    type: {
      mind: { type: Number, default: 0.5 },
      vision: { type: Number, default: 0.5 },
    },
    default: { mind: 0.5, vision: 0.5 },
  })
  scoreWeights: { mind: number; vision: number };

  @Prop({
    type: { largeText: { type: Boolean, default: false } },
    default: { largeText: false },
  })
  a11y: { largeText: boolean };

  @Prop({ default: 0 })
  profileVersion: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
ProfileSchema.index({ userId: 1 });
