import axios from '@/core/services/axios';
import type { GetAllUsersResponse } from '../types/user';

export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('token');
  const response = await axios.get<GetAllUsersResponse>(`${BASE_URL}/usermanagement/users/all`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return response.data;
};
