import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { GlobalMarkdownResponse, CalculatePriceResponse } from '../type/assetMarkdown';
import { assetMarkdownService } from '../services/assetMarkdownService';

interface AssetMarkdownState {
  global: GlobalMarkdownResponse['data'] | null;
  loading: boolean;
  error: string | null;
  lastCalculation: CalculatePriceResponse['data'] | null;
}

const initialState: AssetMarkdownState = {
  global: null,
  loading: false,
  error: null,
  lastCalculation: null,
};

export const fetchGlobalMarkdown = createAsyncThunk('assetMarkdown/fetchGlobal', async () => {
  const res = await assetMarkdownService.getGlobal();
  return res;
});

export const setGlobalMarkdown = createAsyncThunk('assetMarkdown/setGlobal', async (payload: { markdownPercentage: number; description?: string; updatedBy?: string }) => {
  const res = await assetMarkdownService.setGlobal(payload);
  return res;
});

export const toggleGlobalMarkdown = createAsyncThunk('assetMarkdown/toggleGlobal', async (payload: { updatedBy?: string }) => {
  const res = await assetMarkdownService.toggleGlobal(payload);
  return res;
});

export const calculatePrice = createAsyncThunk('assetMarkdown/calculatePrice', async ({ originalPrice, asset }: { originalPrice: number; asset: string }) => {
  const res = await assetMarkdownService.calculatePrice(originalPrice, asset);
  return res;
});

const slice = createSlice({
  name: 'assetMarkdown',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalMarkdown.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchGlobalMarkdown.fulfilled, (state, action) => { state.loading = false; state.global = action.payload?.data ?? null; })
      .addCase(fetchGlobalMarkdown.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to fetch global markdown'; })

      .addCase(setGlobalMarkdown.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(setGlobalMarkdown.fulfilled, (state, action) => { state.loading = false; state.global = action.payload?.data ?? state.global; })
      .addCase(setGlobalMarkdown.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to set global markdown'; })

      .addCase(toggleGlobalMarkdown.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(toggleGlobalMarkdown.fulfilled, (state, action) => { state.loading = false; state.global = action.payload?.data ?? state.global; })
      .addCase(toggleGlobalMarkdown.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to toggle global markdown'; })

      .addCase(calculatePrice.pending, (state) => { state.loading = true; state.error = null; state.lastCalculation = null; })
      .addCase(calculatePrice.fulfilled, (state, action) => { state.loading = false; state.lastCalculation = action.payload?.data ?? null; })
      .addCase(calculatePrice.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to calculate price'; state.lastCalculation = null; });
  }
});

export default slice.reducer;
