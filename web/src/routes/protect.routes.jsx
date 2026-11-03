import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a spinner if preferred
  }

  if (!isAuthenticated) {
    return <Navigate to="/401" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
