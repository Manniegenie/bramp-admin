import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchGiftCardRatesAPI, createGiftCardRateAPI } from '../services/giftCardRateService';
import type { GiftCardRate } from '../type/giftCardRate.types';

export const createGiftCardRate = createAsyncThunk<
  // Return type
  import('../type/giftCardRate.types').GiftCardRate,
  // Arg type
  {
    cardType: string;
    country: string;
    rate: number;
    rateDisplay: string;
    isActive: boolean;
    physicalRate: number;
    ecodeRate: number;
    minAmount: number;
    maxAmount: number;
    vanillaType: string;
    notes?: string;
  }
>(
  'giftCardRates/createGiftCardRate',
  async (data, thunkAPI) => {
    try {
      const res = await createGiftCardRateAPI(data as any);
      return res as any;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || 'Failed to create gift card rate');
    }
  }
);

interface GiftCardRateState {
  rates: GiftCardRate[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRates: number;
    limit: number;
  } | null;
}

const initialState: GiftCardRateState = {
  rates: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchGiftCardRates = createAsyncThunk<
  // Return type
  { rates: import('../type/giftCardRate.types').GiftCardRate[]; pagination: any | null },
  // Arg type
  {
    country?: string;
    cardType?: string;
    vanillaType?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }
>(
  'giftCardRates/fetchGiftCardRates',
  async (params = {}, thunkAPI) => {
    try {
      const res = await fetchGiftCardRatesAPI(params as any);
      return {
        rates: res.data.rates || [],
        pagination: res.data.pagination || null,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || 'Failed to fetch gift card rates');
    }
  }
);

const giftCardRateSlice = createSlice({
  name: 'giftCardRates',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchGiftCardRates.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGiftCardRates.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.rates) {
          state.rates = action.payload.rates;
          state.pagination = action.payload.pagination;
        } else {
          state.rates = [];
          state.pagination = null;
        }
      })
      .addCase(fetchGiftCardRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGiftCardRate.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGiftCardRate.fulfilled, (state, action: PayloadAction<GiftCardRate>) => {
        state.loading = false;
        state.rates = [...state.rates, action.payload];
        // Trigger a refetch to get updated pagination
        fetchGiftCardRates({});
      })
      .addCase(createGiftCardRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default giftCardRateSlice.reducer;