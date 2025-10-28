import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fundUser } from '../services/funding.service';
import type { FundUserRequest, FundUserResponse } from '../types/funding.types';

export const fundUserThunk = createAsyncThunk<FundUserResponse, FundUserRequest, { rejectValue: string }>(
  'funding/fundUser',
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token');
      return await fundUser(data, token);
    } catch (err: unknown) {
  const message = err && typeof err === 'object' && 'message' in err ? (err as Record<string, unknown>).message : 'Funding failed';
  return rejectWithValue(String(message ?? 'Funding failed'));
    }
  }
);

interface FundingState {
  loading: boolean;
  error: string | null;
  response: FundUserResponse | null;
}

const initialState: FundingState = {
  loading: false,
  error: null,
  response: null,
};

const fundingSlice = createSlice({
  name: 'funding',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fundUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.response = null;
      })
      .addCase(fundUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(fundUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const fundingReducer = fundingSlice.reducer;
