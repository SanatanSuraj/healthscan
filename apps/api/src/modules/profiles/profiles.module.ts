import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import {
  ConsentRecord,
  ConsentRecordSchema,
} from './schemas/consent-record.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { TestResult, TestResultSchema } from '../tests/schemas/test-result.schema';
import { AuditLog, AuditLogSchema } from '../audit/schemas/audit-log.schema';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: ConsentRecord.name, schema: ConsentRecordSchema },
      { name: User.name, schema: UserSchema },
      { name: TestResult.name, schema: TestResultSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
