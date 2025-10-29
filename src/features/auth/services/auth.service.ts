import axios from '@/core/services/axios';
import type { LoginCredentials, RegisterCredentials, ResetPasswordCredentials } from '@/core/types/auth.types';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class AuthService {

  async login(credentials: LoginCredentials) {
    try {
      const response = await axios.post(`${BASE_URL}/adminsignin/signin`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }



  async register(credentials: RegisterCredentials) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  }

  async resetPassword(credentials: ResetPasswordCredentials) {
    const response = await fetch(`${BASE_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Password reset failed');
    }

    return response.json();
  }

  async logout() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${BASE_URL}/adminsignin/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        // Optionally handle error (e.g., log or show message)
      }
    }
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService();