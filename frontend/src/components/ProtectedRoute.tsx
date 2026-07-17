// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Array of roles permitted to view this route
}

interface DecodedToken {
  id: string;
  role: string;
  exp: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  // 1. If no token exists, send them straight back to Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // 2. Check token expiration safety guard
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }

    // 3. RBAC Check: If specific roles are required, validate the token payload[cite: 2]
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      // Bounce normal users away from Admin spaces back to the main dashboard safely
      return <Navigate to="/contacts" replace />;
    }
    
    return <>{children}</>;
  } catch (error) {
    // If token parsing breaks down or is corrupted, clear it out safely
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;