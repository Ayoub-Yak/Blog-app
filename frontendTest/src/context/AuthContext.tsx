import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';
import { LoginRequest, ApiErrorResponse } from '../types/api';

interface AuthContextType {
  isAuthenticated: boolean;

  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const hasToken = apiService.isAuthenticated();
    setIsAuthenticated(hasToken);
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      await apiService.login(credentials);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error as ApiErrorResponse;
    }
  };

  const logout = () => {
    apiService.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
