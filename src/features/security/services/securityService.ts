import axios from '@/core/services/axios';
import type { RefreshAdminTokenRequest, RefreshAdminTokenResponse, FetchRefreshTokensResponse } from '../type/security';

const BASE = import.meta.env.VITE_BASE_URL || '';

export const securityService = {
  async refreshAdminToken(payload: RefreshAdminTokenRequest): Promise<RefreshAdminTokenResponse> {
    const url = `${BASE}/adminsignin/refresh-token`;
    const res = await axios.post(url, payload);
    return res.data as RefreshAdminTokenResponse;
  },

  async fetchRefreshTokens(email: string, token: string): Promise<FetchRefreshTokensResponse> {
    const url = `${BASE}/fetching/refresh-tokens?email=${encodeURIComponent(email)}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data as FetchRefreshTokensResponse;
  }
};
