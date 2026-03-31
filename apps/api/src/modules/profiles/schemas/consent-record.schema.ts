import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ConsentRecordDocument = ConsentRecord & mongoose.Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ConsentRecord {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  version: string;

  @Prop()
  acceptedAt: Date;
}

export const ConsentRecordSchema =
  SchemaFactory.createForClass(ConsentRecord);
ConsentRecordSchema.index({ userId: 1, version: 1 });
