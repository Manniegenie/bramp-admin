import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/core/store/store';

export function AuthGuard() {
  const { token } = useSelector((state: RootState) => state.auth);
  const persistedToken = token || localStorage.getItem('token');

  if (!persistedToken) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
}