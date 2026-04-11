import { useState, useCallback, useEffect } from 'react';
import { userService, type UserSearchParams, type UserStats } from '../services/userService';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  kycLevel: number;
  isActive: boolean;
  createdAt: string;
  phoneNumber: string | null;
  emailVerified: boolean;
}

interface UsersResponse {
  success: boolean;
  users: User[];
  meta: {
    filters: {
      email: string | null;
      firstName: string | null;
      lastName: string | null;
      generalQuery: string | null;
      searchField: string | null;
    };
    pagination: {
      currentPage: number;
      totalPages: number;
      totalResults: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    sorting: {
      field: string;
      order: string;
    };
  };
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [searchParams, setSearchParams] = useState<UserSearchParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch users with current search params
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.searchUsers(searchParams);
      setUsers(response.users);
      setPagination(response.meta.pagination);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Fetch user stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await userService.getUserStats();
      setStats(response.stats);
    } catch (err: any) {
      toast.error('Failed to fetch user statistics');
    }
  }, []);

  // Update search params
  const updateSearchParams = useCallback((newParams: Partial<UserSearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...newParams,
      page: newParams.hasOwnProperty('page') ? newParams.page! : 1 // Reset to page 1 if not explicitly set
    }));
  }, []);

  // Lookup specific user
  const lookupUser = useCallback(async (email: string) => {
    try {
      const response = await userService.lookupUser(email);
      return response.user;
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, []);

  // Get user details
  const getUserDetails = useCallback(async (userId: string) => {
    try {
      const response = await userService.getUserDetails(userId);
      return response.user;
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    users,
    loading,
    error,
    stats,
    searchParams,
    pagination,
    updateSearchParams,
    lookupUser,
    getUserDetails,
    refreshUsers: fetchUsers,
    refreshStats: fetchStats
  };
}

export type { User, UsersResponse, UserStats };
