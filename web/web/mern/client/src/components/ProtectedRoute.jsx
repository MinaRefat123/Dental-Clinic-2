import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode token to check expiration
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // If token is expired, clear localStorage and redirect to login
    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      return <Navigate to="/login" replace />;
    }

    // If allowedRoles is specified, check if the user's role is allowed
    if (allowedRoles) {
      if (!role || !allowedRoles.includes(role)) {
        // Redirect based on role
        if (role === 'admin') return <Navigate to="/admin-appointments" replace />;
        if (role === 'doctor') return <Navigate to="/doctor-appointments" replace />;
        return <Navigate to="/account" replace />;
      }
    }

    // If token is valid and role check passes (if applicable), render the children
    return children;
  } catch (err) {
    // If token is invalid (e.g., malformed), clear localStorage and redirect to login
    console.error('Error decoding token:', err);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;