import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserScoreDocument = UserScore & mongoose.Document;

@Schema({ timestamps: true })
export class UserScore {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true })
  userId: mongoose.Types.ObjectId;

  @Prop()
  mind?: number;

  @Prop()
  vision?: number;

  @Prop()
  unified?: number;

  @Prop({ enum: ['green', 'yellow', 'red'] })
  risk?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  windowStats: Record<string, number>;
}

export const UserScoreSchema = SchemaFactory.createForClass(UserScore);
