import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { TestSession, TestSessionDocument } from './schemas/test-session.schema';
import { TestResult, TestResultDocument } from './schemas/test-result.schema';
import {
  IdempotencyKey,
  IdempotencyKeyDocument,
} from './schemas/idempotency-key.schema';
import { CreateSessionDto } from './dto/create-session.dto';
import { SubmitSessionDto } from './dto/submit-session.dto';
import { PatchSessionDto } from './dto/patch-session.dto';
import { UsersService } from '../users/users.service';
import { ProfilesService } from '../profiles/profiles.service';
import { ScoringService } from '../scoring/scoring.service';
import { ScoresService } from '../scores/scores.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EventsGateway } from '../websocket/events.gateway';

@Injectable()
export class TestsService {
  constructor(
    @InjectModel(TestSession.name)
    private readonly sessionModel: Model<TestSessionDocument>,
    @InjectModel(TestResult.name)
    private readonly resultModel: Model<TestResultDocument>,
    @InjectModel(IdempotencyKey.name)
    private readonly idemModel: Model<IdempotencyKeyDocument>,
    private readonly users: UsersService,
    private readonly profiles: ProfilesService,
    private readonly scoring: ScoringService,
    private readonly scores: ScoresService,
    private readonly notifications: NotificationsService,
    private readonly events: EventsGateway,
  ) {}

  async createSession(userId: string, dto: CreateSessionDto) {
    const user = await this.users.findById(userId);
    if (!user) throw new ForbiddenException();

    return this.sessionModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      module: dto.module,
      status: 'draft',
      device: dto.device,
      calibration: dto.calibration,
      clientBatchId: dto.clientBatchId,
      startedAt: new Date(),
    });
  }

  listSessions(userId: string) {
    return this.sessionModel
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
  }

  async patchSession(
    userId: string,
    sessionId: string,
    dto: PatchSessionDto,
  ) {
    const s = await this.sessionModel
      .findOne({
        _id: sessionId,
        userId: new mongoose.Types.ObjectId(userId),
        status: 'draft',
      })
     .exec();
    if (!s) throw new NotFoundException('Session not found');
    if (dto.draftPayload) s.draftPayload = dto.draftPayload;
    await s.save();
    return s;
  }

  async submitSession(
    userId: string,
    sessionId: string,
    dto: SubmitSessionDto,
    idempotencyKey?: string,
  ) {
    if (idempotencyKey) {
      const existing = await this.idemModel
        .findOne({
          userId: new mongoose.Types.ObjectId(userId),
          key: idempotencyKey,
        })
        .exec();
      if (existing?.resultId) {
        const doc = await this.resultModel.findById(existing.resultId).exec();
        if (doc) return doc;
      }
    }

    const session = await this.sessionModel
      .findOne({
        _id: sessionId,
        userId: new mongoose.Types.ObjectId(userId),
        status: 'draft',
      })
      .exec();
    if (!session) throw new NotFoundException('Session not found');

    if (session.module === 'mind' && !dto.mind) {
      throw new BadRequestException('mind payload required');
    }
    if (session.module === 'eye' && !dto.eye) {
      throw new BadRequestException('eye payload required');
    }

    const profile = await this.profiles.ensureProfile(userId);
    const weights = profile.scoreWeights ?? { mind: 0.5, vision: 0.5 };

    const lastMind = await this.resultModel
      .findOne({
        userId: new mongoose.Types.ObjectId(userId),
        module: 'mind',
      })
      .sort({ createdAt: -1 })
      .lean();
    const lastEye = await this.resultModel
      .findOne({
        userId: new mongoose.Types.ObjectId(userId),
        module: 'eye',
      })
      .sort({ createdAt: -1 })
      .lean();

    let subtests: Record<string, unknown>[] = [];
    let mindComposite: number | undefined;
    let visionComposite: number | undefined;

    if (session.module === 'mind') {
      const r = this.scoring.scoreMind(dto.mind!);
      subtests = r.subtests;
      mindComposite = r.composite;
    } else {
      const r = this.scoring.scoreEye(dto.eye!);
      subtests = r.subtests;
      visionComposite = r.composite;
    }

    const effectiveMind =
      session.module === 'mind' ? mindComposite : lastMind?.mindComposite;
    const effectiveVision =
      session.module === 'eye' ? visionComposite : lastEye?.visionComposite;

    const unified = this.scoring.unifiedScore(
      effectiveMind,
      effectiveVision,
      weights,
    );

    const memoryScore = subtests.find((s) => s.key === 'memory')?.score as
      | number
      | undefined;
    const contrastScore = subtests.find((s) => s.key === 'contrast')?.score as
      | number
      | undefined;
    const flags = this.scoring.detectFlags({
      mind: dto.mind,
      eye: dto.eye,
      memoryScore,
      contrastScore,
    });
    const risk = this.scoring.riskBand(unified, flags);

    const result = await this.resultModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      sessionId: session._id,
      module: session.module,
      subtests,
      rawPayload: { ...dto },
      risk,
      mindComposite: effectiveMind,
      visionComposite: effectiveVision,
      unifiedScore: unified,
    });

    session.status = 'completed';
    session.submittedAt = new Date();
    await session.save();

    await this.scores.recomputeSnapshotFromResults(userId);
    await this.scores.evaluateDeclineAndMaybeNotify(userId, unified);

    if (risk === 'red') {
      const n = await this.notifications.createHighRiskReminder(userId);
      this.events.emitScoreAlert(userId, 'alert:new', {
        notificationId: n._id,
        type: 'high_risk',
      });
    }

    if (idempotencyKey) {
      await this.idemModel.findOneAndUpdate(
        {
          userId: new mongoose.Types.ObjectId(userId),
          key: idempotencyKey,
        },
        { resultId: result._id },
        { upsert: true, new: true },
      );
    }

    return result;
  }

  listResults(userId: string) {
    return this.resultModel
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
  }

  async getResult(userId: string, id: string) {
    const r = await this.resultModel
      .findOne({
        _id: id,
        userId: new mongoose.Types.ObjectId(userId),
      })
      .exec();
    if (!r) throw new NotFoundException();
    return r;
  }
}
