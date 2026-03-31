import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';

class ScoreWeightsDto {
  @Min(0.3)
  @Max(0.7)
  mind: number;

  @Min(0.3)
  @Max(0.7)
  vision: number;
}

class A11yDto {
  @IsOptional()
  @IsBoolean()
  largeText?: boolean;
}

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  medicalHistory?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => ScoreWeightsDto)
  scoreWeights?: ScoreWeightsDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => A11yDto)
  a11y?: A11yDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  profileVersion?: number;
}
