import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ScoresService } from './scores.service';

@ApiTags('scores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scores')
export class ScoresController {
  constructor(private readonly scores: ScoresService) {}

  @Get('latest')
  latest(@CurrentUser('userId') userId: string) {
    return this.scores.latest(userId);
  }

  @Get('history')
  history(
    @CurrentUser('userId') userId: string,
    @Query('range') range?: string,
  ) {
    const days =
      range === '7d'
        ? 7
        : range === '90d'
          ? 90
          : range === 'all'
            ? 3650
            : 30;
    return this.scores.history(userId, days);
  }
}
