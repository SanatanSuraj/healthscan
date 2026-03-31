import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TestSessionDocument = TestSession & mongoose.Document;

@Schema({ timestamps: true })
export class TestSession {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true, enum: ['mind', 'eye'] })
  module: string;

  @Prop({
    required: true,
    enum: ['draft', 'completed', 'aborted'],
    default: 'draft',
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  device: Record<string, unknown>;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  calibration?: Record<string, unknown>;

  @Prop()
  startedAt: Date;

  @Prop()
  submittedAt?: Date;

  @Prop({ unique: true, sparse: true })
  clientBatchId?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  draftPayload?: Record<string, unknown>;
}

export const TestSessionSchema = SchemaFactory.createForClass(TestSession);
TestSessionSchema.index({ userId: 1, createdAt: -1 });
