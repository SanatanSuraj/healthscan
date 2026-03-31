import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TestResultDocument = TestResult & mongoose.Document;

@Schema({ timestamps: true })
export class TestResult {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'TestSession', required: true })
  sessionId: mongoose.Types.ObjectId;

  @Prop({ required: true, enum: ['mind', 'eye'] })
  module: string;

  @Prop({ type: [mongoose.Schema.Types.Mixed], default: [] })
  subtests: Record<string, unknown>[];

  @Prop({ type: mongoose.Schema.Types.Mixed })
  rawPayload?: Record<string, unknown>;

  @Prop({ enum: ['green', 'yellow', 'red'] })
  risk: string;

  @Prop()
  mindComposite?: number;

  @Prop()
  visionComposite?: number;

  @Prop()
  unifiedScore?: number;
}

export const TestResultSchema = SchemaFactory.createForClass(TestResult);
TestResultSchema.index({ userId: 1, createdAt: -1 });
TestResultSchema.index({ sessionId: 1 }, { unique: true });
