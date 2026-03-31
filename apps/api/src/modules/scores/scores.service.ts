import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserScore, UserScoreDocument } from './schemas/user-score.schema';
import { TestResult, TestResultDocument } from '../tests/schemas/test-result.schema';
import { ProfilesService } from '../profiles/profiles.service';
import { ScoringService } from '../scoring/scoring.service';
import { RedisService } from '../redis/redis.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EventsGateway } from '../websocket/events.gateway';

@Injectable()
export class ScoresService {
  constructor(
    @InjectModel(UserScore.name)
    private readonly scoreModel: Model<UserScoreDocument>,
    @InjectModel(TestResult.name)
    private readonly resultModel: Model<TestResultDocument>,
    private readonly profiles: ProfilesService,
    private readonly scoring: ScoringService,
    private readonly redis: RedisService,
    private readonly notifications: NotificationsService,
    private readonly events: EventsGateway,
  ) {}

  async latest(userId: string) {
    const cacheKey = `scores:latest:${userId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        /* fall through */
      }
    }
    const doc = await this.scoreModel
      .findOne({
        userId: new mongoose.Types.ObjectId(userId),
      })
      .lean();
    const payload = doc
      ? {
          mind: doc.mind,
          vision: doc.vision,
          unified: doc.unified,
          risk: doc.risk,
          windowStats: doc.windowStats,
          updatedAt: (doc as { updatedAt?: Date }).updatedAt,
        }
      : null;
    if (payload)
      await this.redis.set(cacheKey, JSON.stringify(payload), 60);
    return payload;
  }

  async history(userId: string, rangeDays: number) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - rangeDays);
    const rows = await this.resultModel
      .find({
        userId: new mongoose.Types.ObjectId(userId),
        unifiedScore: { $exists: true },
        createdAt: { $gte: cutoff },
      })
      .sort({ createdAt: 1 })
      .select('createdAt unifiedScore mindComposite visionComposite module risk')
      .lean();
    return { rangeDays, points: rows };
  }

  async recomputeSnapshotFromResults(userId: string) {
    const oid = new mongoose.Types.ObjectId(userId);
    const latestMind = await this.resultModel
      .findOne({ userId: oid, module: 'mind' })
      .sort({ createdAt: -1 })
      .lean();
    const latestEye = await this.resultModel
      .findOne({ userId: oid, module: 'eye' })
      .sort({ createdAt: -1 })
      .lean();
    const profile = await this.profiles.ensureProfile(userId);
    const w = profile.scoreWeights ?? { mind: 0.5, vision: 0.5 };
    const mind = latestMind?.mindComposite ?? undefined;
    const vision = latestEye?.visionComposite ?? undefined;
    const unified = this.scoring.unifiedScore(mind, vision, w);
    const risk = this.scoring.riskBand(unified, {
      critical: latestMind?.risk === 'red' || latestEye?.risk === 'red',
      moderate: latestMind?.risk === 'yellow' || latestEye?.risk === 'yellow',
    });

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const agg = await this.resultModel.aggregate<{
      avg: number;
      count: number;
    }>([
      {
        $match: {
          userId: oid,
          createdAt: { $gte: cutoff },
          unifiedScore: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$unifiedScore' },
          count: { $sum: 1 },
        },
      },
    ]);
    const avg30d = agg[0]?.avg;
    const windowStats: Record<string, number> = {};
    if (avg30d != null) windowStats.avg30dUnified = Math.round(avg30d * 10) / 10;

    await this.scoreModel.findOneAndUpdate(
      { userId: oid },
      {
        mind,
        vision,
        unified,
        risk,
        windowStats,
      },
      { upsert: true, new: true },
    );

    await this.redis.del(`scores:latest:${userId}`);

    return { mind, vision, unified, risk, windowStats };
  }

  async evaluateDeclineAndMaybeNotify(
    userId: string,
    currentUnified: number,
  ): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const oid = new mongoose.Types.ObjectId(userId);
    const prior = await this.resultModel
      .find({
        userId: oid,
        createdAt: { $gte: cutoff },
        unifiedScore: { $exists: true },
      })
      .sort({ createdAt: -1 })
      .skip(1)
      .limit(20)
      .lean();

    if (prior.length < 2) return;

    const sum = prior.reduce((a, r) => a + (r.unifiedScore ?? 0), 0);
    const prevAvg = sum / prior.length;
    if (prevAvg <= 0) return;

    if (currentUnified < prevAvg * 0.85) {
      const n = await this.notifications.createDeclineAlert(
        userId,
        currentUnified,
        prevAvg,
      );
      this.events.emitScoreAlert(userId, 'alert:new', {
        notificationId: n._id,
        type: 'decline_alert',
      });
    }
  }
}
