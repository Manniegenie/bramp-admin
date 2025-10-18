import axios from '@/core/services/axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem('token');

export async function disableTwoFa(email: string) {
  const response = await axios.patch(`${BASE_URL}/2FA-Disable/disable-2fa`, { email }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined,
    }
  });
  return response.data;
}

export default { disableTwoFa };
