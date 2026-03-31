import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class AnalyticsEventItem {
  @IsString()
  event: string;

  @IsOptional()
  @IsObject()
  props?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  anonId?: string;
}

export class AnalyticsBatchDto {
  @ApiProperty({ type: [AnalyticsEventItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnalyticsEventItem)
  events: AnalyticsEventItem[];
}
