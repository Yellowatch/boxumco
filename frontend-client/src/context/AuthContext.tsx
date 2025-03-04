import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

interface AuthContextType {
  user: any;
  access_token: string | null;
  refresh_token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (first_name: string, last_name: string, email: string, number: string, address: string, postcode: string, company_name: string, dob: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const [refresh_token, setRefreshToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/api/users/token/', { email, password });
      console.log(response.data);
      const { refresh, access, email: userEmail, user_id, user_type } = response.data as { refresh: string, access: string, email: string, user_id: any, user_type: string };
      setAccessToken(access);
      setRefreshToken(refresh);
      const user = { user_id, email: userEmail, user_type };
      setUser(user);
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_type', user_type);
    } catch (error: any) {
      // You might want to surface this error to your UI
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_type');
  };

  const register = async (first_name: string, last_name: string, email: string, number: string, address: string, postcode: string, company_name: string, dob: string, password: string) => {
    try {
      const response = await axiosInstance.post('/api/users/clients/', { first_name, last_name, email, number, address, postcode, company_name, dob, password });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data };
    }
  };

  useEffect(() => {
    // Optionally, try to restore auth state from localStorage
    const storedAccessToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      // Optionally, fetch user data using the stored token
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, access_token, refresh_token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
