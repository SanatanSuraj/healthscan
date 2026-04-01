import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { resolveEnvFilePaths } from './env-files';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { TestsModule } from './modules/tests/tests.module';
import { ScoresModule } from './modules/scores/scores.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { RedisModule } from './modules/redis/redis.module';
import { PushModule } from './modules/push/push.module';
import { ScoringModule } from './modules/scoring/scoring.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolveEnvFilePaths(),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const uri =
          config.get<string>('MONGODB_URI')?.trim() ||
          'mongodb://localhost:27017/healthscan';
        return {
          uri,
          serverSelectionTimeoutMS: 10_000,
          retryWrites: true,
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),
    RedisModule,
    ScoringModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    TestsModule,
    ScoresModule,
    NotificationsModule,
    AnalyticsModule,
    AdminModule,
    PushModule,
    WebsocketModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
