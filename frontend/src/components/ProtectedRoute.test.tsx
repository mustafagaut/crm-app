import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jwtDecode } from 'jwt-decode';
import ProtectedRoute from './ProtectedRoute';

// Stub react-router-dom's <Navigate> so this test doesn't need a full
// Router context — we just care about *where* it would redirect to.
jest.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => (
    <div data-testid="navigate" data-to={to} />
  ),
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

const mockedJwtDecode = jwtDecode as jest.Mock;

describe('ProtectedRoute', () => {
  const ChildContent = () => <div>Protected Content</div>;

  beforeEach(() => {
    localStorage.clear();
    mockedJwtDecode.mockReset();
  });

  it('redirects to /login when there is no token', () => {
    render(
      <ProtectedRoute>
        <ChildContent />
      </ProtectedRoute>
    );

    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when the token is valid and no roles are required', () => {
    localStorage.setItem('token', 'valid.token.here');
    mockedJwtDecode.mockReturnValue({
      id: 'u1',
      role: 'User',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    render(
      <ProtectedRoute>
        <ChildContent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('renders children when the decoded role is in allowedRoles', () => {
    localStorage.setItem('token', 'valid.token.here');
    mockedJwtDecode.mockReturnValue({
      id: 'u1',
      role: 'Admin',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    render(
      <ProtectedRoute allowedRoles={['Admin']}>
        <ChildContent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /contacts when the role is not in allowedRoles', () => {
    localStorage.setItem('token', 'valid.token.here');
    mockedJwtDecode.mockReturnValue({
      id: 'u1',
      role: 'User',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    render(
      <ProtectedRoute allowedRoles={['Admin']}>
        <ChildContent />
      </ProtectedRoute>
    );

    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/contacts');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('still renders children when the access token is expired (refresh is handled elsewhere)', () => {
    localStorage.setItem('token', 'valid.token.here');
    mockedJwtDecode.mockReturnValue({
      id: 'u1',
      role: 'User',
      exp: Math.floor(Date.now() / 1000) - 3600, // expired an hour ago
    });

    render(
      <ProtectedRoute>
        <ChildContent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('clears stored tokens and redirects to /login when the token cannot be decoded', () => {
    localStorage.setItem('token', 'garbage-not-a-jwt');
    localStorage.setItem('refreshToken', 'some-refresh-token');
    mockedJwtDecode.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    render(
      <ProtectedRoute>
        <ChildContent />
      </ProtectedRoute>
    );

    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });
});
