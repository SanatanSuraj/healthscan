import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class OtpVerifyDto {
  @ApiProperty()
  @IsString()
  @Matches(/^\+?[1-9]\d{6,14}$/)
  phone: string;

  @ApiProperty()
  @IsString()
  @Length(4, 8)
  code: string;
}
