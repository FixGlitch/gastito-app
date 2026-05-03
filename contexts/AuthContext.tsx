import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authAPI, setApiToken } from '../lib/api/client';
import { User, LoginCredentials, RegisterData, UpdateProfileData, ChangePasswordData } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  refreshUser: () => Promise<void>;
  // Password recovery
  requestPasswordReset: (email: string) => Promise<void>;
  validateResetToken: (token: string) => Promise<any>;
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      if (savedToken) {
        setApiToken(savedToken);
        setToken(savedToken);
        await fetchUser(savedToken);
      }
    } catch (error) {
      console.error('Error loading token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async (authToken: string) => {
    try {
      const response = await authAPI.getProfile(authToken);
      // Manejar tanto { data: { user } } como { user }
      const userData = response?.data?.user || response?.user || response;
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      await logout();
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log("🔐 Intentando login con:", { email: credentials.email });
      const response = await authAPI.login(credentials.email, credentials.password);
      console.log("✅ Login exitoso, respuesta:", response);
      // Tu backend devuelve { data: { tokens: { accessToken }, user } }
      const accessToken = response?.data?.tokens?.accessToken || response?.token;
      const userData = response?.data?.user || response?.user;
      
      if (!accessToken) throw new Error("No se recibió token");
      
      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      setApiToken(accessToken);
      setToken(accessToken);
      setUser(userData);
    } catch (error: any) {
      console.error("❌ Error en login:", error.message, error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log("📝 Intentando registro con:", { name: data.name, email: data.email });
      const response = await authAPI.register(data.name, data.email, data.password);
      console.log("✅ Registro exitoso, respuesta:", response);
      // Tu backend devuelve { data: { tokens: { accessToken }, user } }
      const accessToken = response?.data?.tokens?.accessToken || response?.token;
      const userData = response?.data?.user || response?.user;
      
      if (!accessToken) throw new Error("No se recibió token");
      
      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      setApiToken(accessToken);
      setToken(accessToken);
      setUser(userData);
    } catch (error: any) {
      console.error("❌ Error en registro:", error.message, error);
      throw error;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setApiToken(null);
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    if (!token) throw new Error('No authenticated');
    const updatedUser = await authAPI.updateProfile(data, token);
    setUser(updatedUser);
  };

  const changePassword = async (data: ChangePasswordData) => {
    if (!token) throw new Error('No authenticated');
    await authAPI.changePassword(data, token);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUser(token);
    }
  };

  const requestPasswordReset = async (email: string) => {
    await authAPI.requestPasswordReset(email);
  };

  const validateResetToken = async (resetToken: string) => {
    return await authAPI.validateResetToken(resetToken);
  };

  const resetPassword = async (resetToken: string, newPassword: string, confirmPassword: string) => {
    await authAPI.resetPassword(resetToken, newPassword, confirmPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      refreshUser,
      requestPasswordReset,
      validateResetToken,
      resetPassword,
    }}
  >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
