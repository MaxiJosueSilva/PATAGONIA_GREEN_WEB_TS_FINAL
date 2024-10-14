import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  minLevel: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, minLevel }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userLevel = parseInt(localStorage.getItem('userLevel') || '0', 10);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userLevel < minLevel) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;