import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConsentDto {
  @ApiProperty({ example: '2026-03-31' })
  @IsString()
  version: string;
}
