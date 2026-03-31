import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AnalyticsService } from './analytics.service';
import { AnalyticsBatchDto } from './dto/analytics-batch.dto';
import type { Request } from 'express';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Post('events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  ingest(
    @Body() dto: AnalyticsBatchDto,
    @CurrentUser('userId') userId: string,
    @Req() req: Request,
  ) {
    const ip = req.ip;
    return this.analytics.ingest(userId, dto.events, ip);
  }
}
