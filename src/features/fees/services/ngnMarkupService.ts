import axios from '@/core/services/axios';
import type { MarkupResponse, RateResponse } from '../type/ngnMarkup';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function normalizeRateResponse(raw: unknown): RateResponse {
  let success = false;
  let message: string | undefined = undefined;
  let rate = 0;
  let updatedAt: string | null = null;
  if (raw && typeof raw === 'object') {
  const r = raw as Record<string, unknown>;
  success = typeof r['success'] === 'boolean' ? (r['success'] as boolean) : false;
  message = typeof r['message'] === 'string' ? (r['message'] as string) : undefined;
    const d = r.data ?? {};
    if (d && typeof d === 'object') {
      const dd = d as Record<string, unknown>;
      const possible = (dd['rate'] ?? dd['onrampRate'] ?? dd['offrampRate']) as unknown;
      const n = Number(typeof possible === 'number' ? possible : String(possible));
      rate = Number.isFinite(n) ? n : 0;
      updatedAt = (dd['updatedAt'] ?? dd['lastUpdated'] ?? dd['last_updated']) as string | null | undefined ?? null;
    }
  }
  return { success, message, data: { rate, updatedAt } };
}

export const ngnMarkupService = {
  getMarkupRecord: async (): Promise<MarkupResponse> => {
    const token = localStorage.getItem('token');
    const res = await axios.get<MarkupResponse>(`${BASE_URL}/marker/markup-record`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return res.data;
  },

  updateMarkup: async (markup: number): Promise<MarkupResponse> => {
    const token = localStorage.getItem('token');
    const res = await axios.put<MarkupResponse>(`${BASE_URL}/marker/markup`, { markup }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return res.data;
  },

  getOnrampRate: async (): Promise<RateResponse> => {
    const token = localStorage.getItem('token');
    const res = await axios.get<RateResponse>(`${BASE_URL}/onramp/onramp-rate`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return normalizeRateResponse(res.data);
  },

  setOnrampRate: async (rate: number): Promise<RateResponse> => {
    const token = localStorage.getItem('token');
    const res = await axios.post<RateResponse>(`${BASE_URL}/onramp/onramp-rate`, { rate }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return normalizeRateResponse(res.data);
  },

  getOfframpRate: async (): Promise<RateResponse> => {
    const token = localStorage.getItem('token');
    const res = await axios.get<RateResponse>(`${BASE_URL}/offramp/offramp-rate`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return normalizeRateResponse(res.data);
  },

  setOfframpRate: async (rate: number): Promise<RateResponse> => {
    const token = localStorage.getItem('token');
    const res = await axios.post<RateResponse>(`${BASE_URL}/offramp/offramp-rate`, { rate }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return normalizeRateResponse(res.data);
  },
};
