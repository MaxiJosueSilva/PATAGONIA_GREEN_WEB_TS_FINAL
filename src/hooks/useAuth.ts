import { useEffect, useState } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  userLevel: number;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userLevel: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userLevel = parseInt(localStorage.getItem('userLevel') || '0', 10);

    setAuthState({
      isAuthenticated: !!token,
      userLevel,
    });
  }, []);

  return authState;
};