import React, { createContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import * as api from '../services/api';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const userData = await api.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(userData.role === 'admin');
        } catch (error) {
          console.error("Session check failed", error);
          logout(); // Token is invalid or expired
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (identifier: string, pass: string) => {
    setIsLoading(true);
    try {
      const response = await api.login(identifier, pass);
      
      localStorage.setItem('accessToken', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
      }
      
      // The user object is now part of the login response
      const userData: User = {
        ...response,
        // Ensure balance is a string for consistency
        balance: String(response.balance),
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === 'admin');
      
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const adminLogin = async (identifier: string, pass: string) => {
    // Uses the same login flow, backend determines if the user is an admin.
    await login(identifier, pass);
  }

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAdmin(false);
  };
  
  const updateUser = (newUser: Partial<User>) => {
    setUser(prevUser => {
      if (prevUser) {
        return { ...prevUser, ...newUser };
      }
      return prevUser;
    });
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    isAdmin,
    login,
    adminLogin,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
