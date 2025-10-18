import { useState, useEffect } from 'react';
import type { User } from '../types/user';
import { getAllUsers } from '../services/userService';

export const useUserStore = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((res) => {
        setUsers(res.data.users);
        setTotal(res.data.total);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch users');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { users, total, loading, error };
};
