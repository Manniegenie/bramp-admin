import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RefreshAdminTokenRequest, RefreshAdminTokenResponse, FetchRefreshTokensResponse } from '../type/security';
import { securityService } from '../services/securityService';

interface SecurityState {
  accessToken: string | null;
  refreshTokensForEmail: FetchRefreshTokensResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: SecurityState = {
  accessToken: null,
  refreshTokensForEmail: null,
  loading: false,
  error: null,
};

export const refreshAdminToken = createAsyncThunk('security/refreshAdminToken', async (payload: RefreshAdminTokenRequest) => {
  const res = await securityService.refreshAdminToken(payload);
  return res as RefreshAdminTokenResponse;
});

export const fetchRefreshTokens = createAsyncThunk('security/fetchRefreshTokens', async ({ email, token }: { email: string; token: string }) => {
  const res = await securityService.fetchRefreshTokens(email, token);
  return res as FetchRefreshTokensResponse;
});

const slice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    clearAccessToken(state) { state.accessToken = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAdminToken.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(refreshAdminToken.fulfilled, (state, action) => { state.loading = false; state.accessToken = action.payload.accessToken ?? null; })
      .addCase(refreshAdminToken.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to refresh token'; })

      .addCase(fetchRefreshTokens.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRefreshTokens.fulfilled, (state, action) => { state.loading = false; state.refreshTokensForEmail = action.payload; })
      .addCase(fetchRefreshTokens.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to fetch refresh tokens'; });
  }
});

export const { clearAccessToken } = slice.actions;
export default slice.reducer;
