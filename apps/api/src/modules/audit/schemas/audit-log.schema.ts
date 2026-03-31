import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AuditLogDocument = AuditLog & mongoose.Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AuditLog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  actorUserId?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  action: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  meta: Record<string, unknown>;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.index({ createdAt: -1 });
