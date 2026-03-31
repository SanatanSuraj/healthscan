import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ enum: ['mind', 'eye'] })
  @IsEnum(['mind', 'eye'])
  module: 'mind' | 'eye';

  @ApiProperty()
  @IsObject()
  device: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  calibration?: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  clientBatchId?: string;
}
