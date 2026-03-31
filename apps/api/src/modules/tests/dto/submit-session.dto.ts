import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';
import type { MindPayload, EyePayload } from '../../scoring/scoring.service';

export class SubmitSessionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  mind?: MindPayload;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  eye?: EyePayload;
}
