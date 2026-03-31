export type RiskBand = 'green' | 'yellow' | 'red';

export type TestModule = 'mind' | 'eye';

export interface ScoreLatestDto {
  mind?: number;
  vision?: number;
  unified?: number;
  risk?: RiskBand;
  windowStats?: Record<string, number>;
  updatedAt?: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
}
