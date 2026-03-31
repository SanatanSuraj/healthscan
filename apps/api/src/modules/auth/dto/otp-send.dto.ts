import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class OtpSendDto {
  @ApiProperty({ example: '+15550001111' })
  @IsString()
  @Matches(/^\+?[1-9]\d{6,14}$/)
  phone: string;
}
