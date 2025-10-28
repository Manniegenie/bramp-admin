import axios from '@/core/services/axios';
import type { FundUserRequest, FundUserResponse } from '../types/funding.types';

export async function fundUser(data: FundUserRequest, token: string): Promise<FundUserResponse> {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const res = await axios.post(`${BASE_URL}/fund/fund-user`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}
