import axios from '@/core/services/axios';
import type { GlobalMarkdownResponse, CalculatePriceResponse } from '../type/assetMarkdown';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function normalizeGlobalResponse(raw: unknown): GlobalMarkdownResponse {
  let success = false;
  let message: string | undefined = undefined;
  let data: GlobalMarkdownResponse['data'] | null = null;
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, unknown>;
    success = typeof r['success'] === 'boolean' ? (r['success'] as boolean) : false;
    message = typeof r['message'] === 'string' ? (r['message'] as string) : undefined;
    const d = r['data'] as Record<string, unknown> | undefined;
    if (d) {
      const markdownPercentage = Number(d['markdownPercentage'] ?? d['markdown'] ?? NaN) || 0;
      const formattedPercentage = typeof d['formattedPercentage'] === 'string' ? (d['formattedPercentage'] as string) : undefined;
      const description = typeof d['description'] === 'string' ? (d['description'] as string) : undefined;
      const isActive = typeof d['isActive'] === 'boolean' ? (d['isActive'] as boolean) : Boolean(d['active'] ?? false);
      const updatedAt = (d['updatedAt'] ?? d['lastUpdated'] ?? d['last_updated']) as string | null | undefined ?? null;
      const updatedBy = typeof d['updatedBy'] === 'string' ? (d['updatedBy'] as string) : undefined;
      data = { markdownPercentage, formattedPercentage, description, isActive, updatedAt, updatedBy };
    }
  }
  return { success, message, data };
}

export const assetMarkdownService = {
  getGlobal: async (): Promise<GlobalMarkdownResponse> => {
    const res = await axios.get(`${BASE_URL}/asset-markdown/global`);
    return normalizeGlobalResponse(res.data);
  },

  setGlobal: async (payload: { markdownPercentage: number; description?: string; updatedBy?: string; }) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${BASE_URL}/asset-markdown/set-global`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      }
    });
    return normalizeGlobalResponse(res.data);
  },

  toggleGlobal: async (payload: { updatedBy?: string }) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${BASE_URL}/asset-markdown/toggle-global`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return normalizeGlobalResponse(res.data);
  },

  calculatePrice: async (originalPrice: number, asset: string): Promise<CalculatePriceResponse> => {
    const res = await axios.get(`${BASE_URL}/asset-markdown/calculate-price?originalPrice=${encodeURIComponent(originalPrice)}&asset=${encodeURIComponent(asset)}`);
    // minimal normalization: return as-is but ensure fields exist
    const raw = res.data;
    const success = raw?.success ?? false;
    return { success, message: raw?.message, data: raw?.data ?? null } as CalculatePriceResponse;
  }
};
