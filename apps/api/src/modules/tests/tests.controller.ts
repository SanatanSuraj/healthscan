import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TestsService } from './tests.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SubmitSessionDto } from './dto/submit-session.dto';
import { PatchSessionDto } from './dto/patch-session.dto';

@ApiTags('tests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class TestsController {
  constructor(private readonly tests: TestsService) {}

  @Post()
  create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateSessionDto,
  ) {
    return this.tests.createSession(userId, dto);
  }

  @Get()
  list(@CurrentUser('userId') userId: string) {
    return this.tests.listSessions(userId);
  }

  @Patch(':id')
  patch(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: PatchSessionDto,
  ) {
    return this.tests.patchSession(userId, id, dto);
  }

  @Post(':id/submit')
  @ApiHeader({ name: 'idempotency-key', required: false })
  submit(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: SubmitSessionDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.tests.submitSession(userId, id, dto, idempotencyKey);
  }
}

@ApiTags('results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('results')
export class ResultsController {
  constructor(private readonly tests: TestsService) {}

  @Get()
  list(@CurrentUser('userId') userId: string) {
    return this.tests.listResults(userId);
  }

  @Get(':id')
  one(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.tests.getResult(userId, id);
  }
}
