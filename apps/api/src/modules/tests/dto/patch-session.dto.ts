import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';

export class PatchSessionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  draftPayload?: Record<string, unknown>;
}
