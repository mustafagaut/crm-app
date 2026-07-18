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

    // Note: we deliberately don't force a redirect here just because the
    // access token's `exp` has passed. The token is short-lived (15 min) by
    // design, and the axios response interceptor in services/api.ts will
    // transparently use the refresh token to get a new one on the next API
    // call. Bouncing to /login here would defeat the point of having a
    // refresh token at all. If the refresh token has also expired, the
    // interceptor itself clears storage and redirects.

    // RBAC Check: If specific roles are required, validate the token payload
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      // Bounce normal users away from Admin spaces back to the main dashboard safely
      return <Navigate to="/contacts" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    // If token parsing breaks down or is corrupted, clear it out safely
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;