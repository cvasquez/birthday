import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedLayout() {
  const { user } = useAuth();

  // Redirect to login page if user is not authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Render the child routes if user is authenticated
  return <Outlet />;
}
