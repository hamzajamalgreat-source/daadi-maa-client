import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * ProtectedRoute — wraps admin pages.
 * Redirects to /admin/login if not authenticated or token has expired.
 * Preserves the attempted URL so after login we can redirect back.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isTokenValid } = useAuthStore();
  const location = useLocation();

  // If stored as authenticated but token has expired, still block
  const isValid = isAuthenticated && isTokenValid();

  if (!isValid) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
