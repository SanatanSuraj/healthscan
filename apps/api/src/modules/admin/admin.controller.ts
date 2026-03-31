import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { AuditLog, AuditLogDocument } from '../audit/schemas/audit-log.schema';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
    @InjectModel(AuditLog.name) private readonly audits: Model<AuditLogDocument>,
  ) {}

  @Get('users')
  async listUsers() {
    const rows = await this.users
      .find()
      .select('email phone isGuest createdAt roles')
      .limit(200)
      .lean();
    return { users: rows };
  }

  @Get('audit/recent')
  recentAudits() {
    return this.audits.find().sort({ createdAt: -1 }).limit(100).lean();
  }
}
