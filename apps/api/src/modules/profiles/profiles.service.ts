import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import {
  ConsentRecord,
  ConsentRecordDocument,
} from './schemas/consent-record.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { TestResult, TestResultDocument } from '../tests/schemas/test-result.schema';
import { AuditLog, AuditLogDocument } from '../audit/schemas/audit-log.schema';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel(ConsentRecord.name)
    private readonly consentModel: Model<ConsentRecordDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(TestResult.name)
    private readonly resultModel: Model<TestResultDocument>,
    @InjectModel(AuditLog.name)
    private readonly auditModel: Model<AuditLogDocument>,
  ) {}

  async ensureProfile(userId: string): Promise<ProfileDocument> {
    const id = new mongoose.Types.ObjectId(userId);
    let p = await this.profileModel.findOne({ userId: id }).exec();
    if (!p) {
      p = await this.profileModel.create({
        userId: id,
        medicalHistory: {},
        scoreWeights: { mind: 0.5, vision: 0.5 },
        a11y: { largeText: false },
      });
    }
    return p;
  }

  async getProfile(userId: string) {
    const p = await this.ensureProfile(userId);
    return p;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const p = await this.ensureProfile(userId);
    if (
      dto.profileVersion != null &&
      dto.profileVersion !== p.profileVersion
    ) {
      throw new ConflictException('Profile was updated elsewhere');
    }
    const { profileVersion: _pv, ...rest } = dto;
    Object.assign(p, {
      ...rest,
      profileVersion: p.profileVersion + 1,
    });
    await p.save();
    return p;
  }

  async recordConsent(userId: string, version: string) {
    const id = new mongoose.Types.ObjectId(userId);
    await this.consentModel.create({
      userId: id,
      version,
      acceptedAt: new Date(),
    });
    await this.profileModel.updateOne(
      { userId: id },
      { consentVersion: version, consentAcceptedAt: new Date() },
    );
    return { ok: true, version };
  }

  async exportData(userId: string) {
    const id = new mongoose.Types.ObjectId(userId);
    const [user, profile, results, consents] = await Promise.all([
      this.userModel.findById(id).select('-passwordHash').lean(),
      this.profileModel.findOne({ userId: id }).lean(),
      this.resultModel.find({ userId: id }).sort({ createdAt: -1 }).lean(),
      this.consentModel.find({ userId: id }).lean(),
    ]);
    await this.auditModel.create({
      actorUserId: id,
      action: 'data_export',
      meta: {},
    });
    return {
      exportedAt: new Date().toISOString(),
      user,
      profile,
      testResults: results,
      consents,
    };
  }

  async requestErasure(userId: string) {
    await this.userModel.updateOne(
      { _id: userId },
      { deletionRequestedAt: new Date() },
    );
    await this.auditModel.create({
      actorUserId: new mongoose.Types.ObjectId(userId),
      action: 'erasure_requested',
      meta: {},
    });
    return {
      message:
        'Deletion scheduled per policy (within 30 days). You may lose access immediately.',
    };
  }
}
