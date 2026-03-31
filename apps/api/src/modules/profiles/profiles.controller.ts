import { Body, Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ConsentDto } from './dto/consent.dto';

@ApiTags('me')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me')
export class ProfilesController {
  constructor(private readonly profiles: ProfilesService) {}

  @Get('profile')
  getProfile(@CurrentUser('userId') userId: string) {
    return this.profiles.getProfile(userId);
  }

  @Put('profile')
  updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profiles.updateProfile(userId, dto);
  }

  @Post('consent')
  consent(
    @CurrentUser('userId') userId: string,
    @Body() dto: ConsentDto,
  ) {
    return this.profiles.recordConsent(userId, dto.version);
  }

  @Get('export')
  export(@CurrentUser('userId') userId: string) {
    return this.profiles.exportData(userId);
  }

  @Delete()
  erase(@CurrentUser('userId') userId: string) {
    return this.profiles.requestErasure(userId);
  }
}
