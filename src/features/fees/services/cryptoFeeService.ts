import axios from '@/core/services/axios';
import type { CryptoFeesResponse, CryptoFeeResponse, CryptoFeeUpdateResponse } from '../type/fee';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const cryptoFeeService = {
  getCryptoFees: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get<CryptoFeesResponse>(`${BASE_URL}/set-fee/crypto-fee`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  },

  getCryptoFee: async (currency: string, network: string) => {
    const response = await axios.get<CryptoFeeResponse>(`${BASE_URL}/set-fee/crypto-fee/${encodeURIComponent(currency)}/${encodeURIComponent(network)}`);
    return response.data;
  },

  updateCryptoFee: async (payload: { currency: string; network: string; networkName: string; networkFee: number }) => {
    const token = localStorage.getItem('token');
    const response = await axios.put<CryptoFeeUpdateResponse>(`${BASE_URL}/set-fee/crypto-fee`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  },

  updateCryptoNetworkName: async (payload: { currency: string; network: string; networkName: string }) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch<CryptoFeeUpdateResponse>(`${BASE_URL}/set-fee/crypto-fee-name`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  },
};