import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestSession, TestSessionSchema } from './schemas/test-session.schema';
import { TestResult, TestResultSchema } from './schemas/test-result.schema';
import {
  IdempotencyKey,
  IdempotencyKeySchema,
} from './schemas/idempotency-key.schema';
import { TestsService } from './tests.service';
import { TestsController, ResultsController } from './tests.controller';
import { UsersModule } from '../users/users.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { ScoresModule } from '../scores/scores.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TestSession.name, schema: TestSessionSchema },
      { name: TestResult.name, schema: TestResultSchema },
      { name: IdempotencyKey.name, schema: IdempotencyKeySchema },
    ]),
    UsersModule,
    ProfilesModule,
    ScoresModule,
    NotificationsModule,
    WebsocketModule,
  ],
  controllers: [TestsController, ResultsController],
  providers: [TestsService],
  exports: [TestsService],
})
export class TestsModule {}
