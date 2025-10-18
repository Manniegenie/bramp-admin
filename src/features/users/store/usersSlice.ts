import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../types/user';
import { getUsers, deleteUser as deleteUserService } from '../services/usersService';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params?: Record<string, string | number | boolean>) => {
    const res = await getUsers(params);
    return res;
  }
);

export const removeUser = createAsyncThunk(
  'users/removeUser',
  async (email: string) => {
    const res = await deleteUserService(email);
    return res;
  }
);

interface UsersState {
  users: User[];
  pagination: { total: number; limit: number; skip: number; hasMore: boolean } | null;
  loading: boolean;
  error: string | null;
  deleteLoading: boolean;
}

const initialState: UsersState = {
  users: [],
  pagination: null,
  loading: false,
  error: null,
  deleteLoading: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload?.data?.users ?? [];
        state.pagination = action.payload?.data?.pagination ?? null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch users';
      })
      .addCase(removeUser.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(removeUser.fulfilled, (state) => {
        state.deleteLoading = false;
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.error.message ?? 'Failed to delete user';
      });
  },
});

export default usersSlice.reducer;
