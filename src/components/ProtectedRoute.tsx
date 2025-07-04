
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'storyteller' | 'creator';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useUser();
  const location = useLocation();

  console.log('ProtectedRoute: Current state:', { 
    user: user?.id, 
    userRole: user?.role, 
    loading, 
    requiredRole, 
    pathname: location.pathname 
  });

  // Check if user has demo access
  const hasDemoAccess = sessionStorage.getItem('creators-access') === 'true';

  console.log('ProtectedRoute: Demo access check:', { hasDemoAccess });

  if (loading) {
    console.log('ProtectedRoute: Still loading, showing loading screen');
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow demo users to access all protected routes
  if (hasDemoAccess) {
    console.log('ProtectedRoute: Demo access granted, rendering children');
    return <>{children}</>;
  }

  if (!user) {
    console.log('ProtectedRoute: No user and no demo access, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log('ProtectedRoute: Role mismatch, redirecting to correct dashboard');
    // Redirect to the correct dashboard based on user role
    const redirectPath = user.role === 'storyteller' ? '/storyteller-dashboard' : '/creator-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  console.log('ProtectedRoute: All checks passed, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
