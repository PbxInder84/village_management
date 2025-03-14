import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const token = localStorage.getItem('token');
  
  if ((!isAuthenticated && !loading) || !token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute; 