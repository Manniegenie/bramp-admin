import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import cryptoFeeReducer from '../../store/cryptoFeeSlice';
import * as service from '../../services/cryptoFeeService';
import ViewFee from '../ViewFee';

const mockFee = {
  currency: 'BTC',
  network: 'Bitcoin',
  networkName: 'Bitcoin Network',
  networkFee: 0.0001,
};

describe('ViewFee page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and displays canonical fee when route params present', async () => {
    vi.spyOn(service.cryptoFeeService, 'getCryptoFee').mockResolvedValue({ data: mockFee });

    const store = configureStore({ reducer: { cryptoFee: cryptoFeeReducer } });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/fees-rates/view/BTC/Bitcoin"]}>
          <Routes>
            <Route path="/fees-rates/view/:currency/:network" element={<ViewFee />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Bitcoin Network')).toBeDefined());
    expect(screen.getByText('0.0001')).toBeDefined();
  });
});
