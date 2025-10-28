export interface RefreshAdminTokenRequest {
  refreshToken: string;
}

export interface RefreshAdminTokenResponse {
  success: boolean;
  accessToken?: string;
  message?: string;
}

export interface RefreshTokenRecord {
  token: string;
  createdAt: string;
}

export interface FetchRefreshTokensResponse {
  email: string;
  refreshTokens: RefreshTokenRecord[];
}
