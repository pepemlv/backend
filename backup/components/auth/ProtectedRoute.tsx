import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but save the current location they were trying to go to
    return <Navigate to={`/login?redirectTo=${location.pathname}`} replace />;
  }

  return <>{children}</>;
}