import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AnalyticsEventDocument = AnalyticsEvent & mongoose.Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AnalyticsEvent {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId?: mongoose.Types.ObjectId;

  @Prop()
  anonId?: string;

  @Prop({ required: true })
  event: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  props: Record<string, unknown>;

  @Prop({ default: () => new Date() })
  ts: Date;
}

export const AnalyticsEventSchema =
  SchemaFactory.createForClass(AnalyticsEvent);
AnalyticsEventSchema.index({ ts: 1 }, { expireAfterSeconds: 90 * 24 * 3600 });
AnalyticsEventSchema.index({ event: 1, ts: -1 });
