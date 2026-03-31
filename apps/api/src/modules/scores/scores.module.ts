import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserScore, UserScoreSchema } from './schemas/user-score.schema';
import { TestResult, TestResultSchema } from '../tests/schemas/test-result.schema';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { ProfilesModule } from '../profiles/profiles.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserScore.name, schema: UserScoreSchema },
      { name: TestResult.name, schema: TestResultSchema },
    ]),
    ProfilesModule,
    NotificationsModule,
    WebsocketModule,
  ],
  controllers: [ScoresController],
  providers: [ScoresService],
  exports: [ScoresService],
})
export class ScoresModule {}
