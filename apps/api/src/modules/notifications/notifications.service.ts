import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly model: Model<NotificationDocument>,
  ) {}

  list(userId: string) {
    return this.model
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
  }

  async markRead(userId: string, id: string) {
    await this.model.updateOne(
      {
        _id: id,
        userId: new mongoose.Types.ObjectId(userId),
      },
      { readAt: new Date() },
    );
    return { ok: true };
  }

  async createDeclineAlert(
    userId: string,
    currentUnified: number,
    prevAvg: number,
  ) {
    return this.model.create({
      userId: new mongoose.Types.ObjectId(userId),
      type: 'decline_alert',
      title: 'Notable score change',
      body: 'Your screening score changed compared to your recent average. This tool does not diagnose — speak with a clinician if concerned.',
      payload: { currentUnified, prevAvg, thresholdPct: 15 },
    });
  }

  async createHighRiskReminder(userId: string) {
    return this.model.create({
      userId: new mongoose.Types.ObjectId(userId),
      type: 'high_risk',
      title: 'Follow-up suggested',
      body: 'A recent screening flagged higher concern. Consider an eye or cognitive health professional.',
      payload: {},
    });
  }
}
