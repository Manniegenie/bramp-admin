import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import cryptoFeeReducer, { fetchCryptoFee } from '../cryptoFeeSlice';
import * as service from '../../services/cryptoFeeService';
import type { CryptoFeeResponse } from '../../type/fee';

const mockFee = {
  currency: 'BTC',
  network: 'Bitcoin',
  networkName: 'Bitcoin Network',
  networkFee: 0.0001,
};

describe('cryptoFeeSlice thunk', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchCryptoFee should populate selectedFee on success', async () => {
    // mock the service method
  vi.spyOn(service.cryptoFeeService, 'getCryptoFee').mockResolvedValue({ data: mockFee } as unknown as CryptoFeeResponse);

    // Build store
    const store = configureStore({ reducer: { cryptoFee: cryptoFeeReducer } });

    // Dispatch thunk
  await store.dispatch(fetchCryptoFee({ currency: 'BTC', network: 'Bitcoin' }));

  const state = store.getState();
  expect(state.cryptoFee.selectedFee).toEqual(mockFee);
  });
});
