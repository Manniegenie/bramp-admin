import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { CryptoFee } from '../type/fee';
import { cryptoFeeService } from '../services/cryptoFeeService';

interface CryptoFeeState {
  fees: CryptoFee[];
  loading: boolean;
  error: string | null;
  selectedFee: CryptoFee | null;
}

const initialState: CryptoFeeState = {
  fees: [],
  loading: false,
  error: null,
  selectedFee: null,
};

export const fetchCryptoFees = createAsyncThunk(
  'cryptoFee/fetchCryptoFees',
  async () => {
    const response = await cryptoFeeService.getCryptoFees();
    return response;
  }
);

export const fetchCryptoFee = createAsyncThunk(
  'cryptoFee/fetchCryptoFee',
  async ({ currency, network }:{ currency:string; network:string }) => {
    const response = await cryptoFeeService.getCryptoFee(currency, network);
    return response;
  }
);

export const updateCryptoFee = createAsyncThunk(
  'cryptoFee/updateCryptoFee',
  async (payload: { currency: string; network: string; networkName: string; networkFee: number }) => {
    const response = await cryptoFeeService.updateCryptoFee(payload);
    return response;
  }
);

export const updateCryptoNetworkName = createAsyncThunk(
  'cryptoFee/updateCryptoNetworkName',
  async (payload: { currency: string; network: string; networkName: string }) => {
    const response = await cryptoFeeService.updateCryptoNetworkName(payload);
    return response;
  }
);

export const createCryptoFee = createAsyncThunk(
  'cryptoFee/createCryptoFee',
  async (payload: { currency: string; network: string; networkName: string; networkFee: number }) => {
    const response = await cryptoFeeService.createCryptoFee(payload);
    return response;
  }
);

export const deleteCryptoFee = createAsyncThunk(
  'cryptoFee/deleteCryptoFee',
  async ({ currency, network }: { currency: string; network: string }) => {
    const response = await cryptoFeeService.deleteCryptoFee(currency, network);
    return { response, currency, network };
  }
);

const cryptoFeeSlice = createSlice({
  name: 'cryptoFee',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoFees.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = action.payload?.data ?? [];
      })
      .addCase(fetchCryptoFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto fees';
      });
    builder
      .addCase(fetchCryptoFee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedFee = null;
      })
      .addCase(fetchCryptoFee.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFee = action.payload?.data ?? null;
      })
      .addCase(fetchCryptoFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto fee';
        state.selectedFee = null;
      });
    builder
      .addCase(createCryptoFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCryptoFee.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.fees.push(action.payload.data);
        }
      })
      .addCase(createCryptoFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create crypto fee';
      });
    builder
      .addCase(deleteCryptoFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCryptoFee.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = state.fees.filter(
          fee => !(fee.currency === action.payload.currency && fee.network === action.payload.network)
        );
      })
      .addCase(deleteCryptoFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete crypto fee';
      });
  },
});

export default cryptoFeeSlice.reducer;