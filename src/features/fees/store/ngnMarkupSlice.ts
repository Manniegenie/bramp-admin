import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { MarkupRecord, MarkupResponse, RateRecord, RateResponse } from '../type/ngnMarkup';
import { ngnMarkupService } from '../services/ngnMarkupService';

interface NgnMarkupState {
  markup: MarkupRecord | null;
  onramp: RateRecord | null;
  offramp: RateRecord | null;
  loading: boolean;
  error: string | null;
}

const initialState: NgnMarkupState = {
  markup: null,
  onramp: null,
  offramp: null,
  loading: false,
  error: null,
};

export const fetchNgnMarkup = createAsyncThunk('ngn/fetchMarkup', async () => {
  const res: MarkupResponse = await ngnMarkupService.getMarkupRecord();
  return res;
});

export const updateNgnMarkup = createAsyncThunk('ngn/updateMarkup', async (markup: number) => {
  const res: MarkupResponse = await ngnMarkupService.updateMarkup(markup);
  return res;
});

export const fetchOnramp = createAsyncThunk('ngn/fetchOnramp', async () => {
  const res: RateResponse = await ngnMarkupService.getOnrampRate();
  return res;
});

export const setOnramp = createAsyncThunk('ngn/setOnramp', async (rate: number) => {
  const res: RateResponse = await ngnMarkupService.setOnrampRate(rate);
  return res;
});

export const fetchOfframp = createAsyncThunk('ngn/fetchOfframp', async () => {
  const res: RateResponse = await ngnMarkupService.getOfframpRate();
  return res;
});

export const setOfframp = createAsyncThunk('ngn/setOfframp', async (rate: number) => {
  const res: RateResponse = await ngnMarkupService.setOfframpRate(rate);
  return res;
});

const ngnSlice = createSlice({
  name: 'ngn',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNgnMarkup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNgnMarkup.fulfilled, (state, action) => {
        state.loading = false;
        state.markup = action.payload?.data ?? null;
      })
      .addCase(fetchNgnMarkup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch markup';
      })

      .addCase(updateNgnMarkup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNgnMarkup.fulfilled, (state, action) => {
        state.loading = false;
        state.markup = action.payload?.data ?? state.markup;
      })
      .addCase(updateNgnMarkup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update markup';
      })

      .addCase(fetchOnramp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnramp.fulfilled, (state, action) => {
        state.loading = false;
        state.onramp = action.payload?.data ?? null;
      })
      .addCase(fetchOnramp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch onramp rate';
      })

      .addCase(setOnramp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setOnramp.fulfilled, (state, action) => {
        state.loading = false;
        state.onramp = action.payload?.data ?? state.onramp;
      })
      .addCase(setOnramp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to set onramp rate';
      })

      .addCase(fetchOfframp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOfframp.fulfilled, (state, action) => {
        state.loading = false;
        state.offramp = action.payload?.data ?? null;
      })
      .addCase(fetchOfframp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch offramp rate';
      })

      .addCase(setOfframp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setOfframp.fulfilled, (state, action) => {
        state.loading = false;
        state.offramp = action.payload?.data ?? state.offramp;
      })
      .addCase(setOfframp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to set offramp rate';
      });
  },
});

export default ngnSlice.reducer;
