import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type IdempotencyKeyDocument = IdempotencyKey & mongoose.Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class IdempotencyKey {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  key: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'TestResult' })
  resultId?: mongoose.Types.ObjectId;
}

export const IdempotencyKeySchema =
  SchemaFactory.createForClass(IdempotencyKey);
IdempotencyKeySchema.index({ userId: 1, key: 1 }, { unique: true });
