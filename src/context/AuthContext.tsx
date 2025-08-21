import React, { createContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import * as api from '../services/api';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAwaiting2FA, setIsAwaiting2FA] = useState<boolean>(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleSuccessfulLogin = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    const userData = await api.getProfile();
    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(userData.role === 'admin');
    setIsAwaiting2FA(false);
    setTempUserId(null);
  };

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
    setIsAwaiting2FA(false);
    try {
      const response = await api.login(identifier, pass);
      if ('two_factor_required' in response && response.two_factor_required) {
        setIsAwaiting2FA(true);
        setTempUserId(response.user_id);
        return { twoFactorRequired: true, userId: response.user_id };
      } else if ('access' in response) {
        await handleSuccessfulLogin(response.access, response.refresh);
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const adminLogin = async (identifier: string, pass: string) => {
    setIsLoading(true);
    try {
        // The backend doc implies a single login endpoint. We assume the backend
        // handles role detection. If login is successful, getProfile will determine the role.
        const response = await api.login(identifier, pass);
        if ('access' in response) {
            await handleSuccessfulLogin(response.access, response.refresh);
        } else {
            // Admin accounts should not have 2FA according to this flow,
            // but if they did, it would need to be handled.
            throw new Error("Admin login failed or requires 2FA, which is not supported in this flow.");
        }
    } catch(error) {
        console.error(error);
        throw error;
    } finally {
        setIsLoading(false);
    }
  }

  const verifyTwoFactor = async (userId: string, token: string) => {
      setIsLoading(true);
      try {
          const response = await api.verifyTwoFactor(userId, token);
          await handleSuccessfulLogin(response.access, response.refresh);
      } catch (error) {
          console.error(error);
          throw error;
      } finally {
          setIsLoading(false);
      }
  }

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAwaiting2FA(false);
    setTempUserId(null);
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
    verifyTwoFactor,
    isAwaiting2FA,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};