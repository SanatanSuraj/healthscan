import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('healthz')
export class HealthController {
  @Get()
  getHealth() {
    return { status: 'ok', service: 'healthscan-api' };
  }
}
