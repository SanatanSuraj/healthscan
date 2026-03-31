import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import {
  AnalyticsEvent,
  AnalyticsEventDocument,
} from './schemas/analytics-event.schema';
import * as crypto from 'crypto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(AnalyticsEvent.name)
    private readonly model: Model<AnalyticsEventDocument>,
  ) {}

  async ingest(
    userId: string | undefined,
    events: { event: string; props?: Record<string, unknown>; anonId?: string }[],
    ip?: string,
  ) {
    const ipHash = ip
      ? crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16)
      : undefined;
    const docs = events.map((e) => ({
      userId: userId
        ? new mongoose.Types.ObjectId(userId)
        : undefined,
      anonId: e.anonId,
      event: e.event,
      props: { ...e.props, ipHash },
      ts: new Date(),
    }));
    await this.model.insertMany(docs);
    return { accepted: docs.length };
  }

  /** Example DAU aggregation (run in Atlas or scheduled job). */
  dauPipeline(day: Date) {
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return [
      {
        $match: {
          event: 'app_open',
          ts: { $gte: start, $lt: end },
          userId: { $exists: true, $ne: null },
        },
      },
      { $group: { _id: '$userId' } },
      { $count: 'dau' },
    ];
  }
}
