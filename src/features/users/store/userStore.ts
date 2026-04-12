import { useState, useEffect } from 'react';
import type { User } from '../types/user';
import { getUsers } from '../services/usersService';

export const useUserStore = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((res: import('../types/user').GetUsersResponse) => {
        setUsers(res.data?.users ?? []);
        setTotal(res.data?.pagination?.total ?? 0);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message || 'Failed to fetch users');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { users, total, loading, error };
};
