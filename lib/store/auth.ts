import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { setApiToken, authAPI } from "../api/client";
import type { User } from "../../types/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: async (email: string, password: string) => {
        try {
          const data = await authAPI.login(email, password);
          if (data.token) {
            await SecureStore.setItemAsync("auth-token", data.token);
            setApiToken(data.token);
            // Fetch user profile after login
            const user = await authAPI.getProfile(data.token);
            set({ token: data.token, user, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error("No se recibió token");
          }
        } catch (error: any) {
          throw new Error(error.message || "Error al iniciar sesión");
        }
      },
      register: async (name: string, email: string, password: string) => {
        try {
          const data = await authAPI.register(name, email, password);
          if (data.token) {
            await SecureStore.setItemAsync("auth-token", data.token);
            setApiToken(data.token);
            // Fetch user profile after register
            const user = await authAPI.getProfile(data.token);
            set({ token: data.token, user, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error("No se recibió token");
          }
        } catch (error: any) {
          throw new Error(error.message || "Error al registrarse");
        }
      },
      logout: async () => {
        await SecureStore.deleteItemAsync("auth-token");
        setApiToken(null);
        set({ token: null, isAuthenticated: false, user: null, isLoading: false });
      },
      checkAuth: async () => {
        try {
          const token = await SecureStore.getItemAsync("auth-token");
          if (token) {
            setApiToken(token);
            // Verificar token obteniendo perfil
            const response = await authAPI.getProfile(token);
            // Manejar tanto { data: { user } } como { user }
            const user = response?.data?.user || response?.user || response;
            set({ token, isAuthenticated: true, isLoading: false, user });
          } else {
            set({ isAuthenticated: false, isLoading: false, token: null, user: null });
          }
        } catch (error) {
          // Token inválido
          await SecureStore.deleteItemAsync("auth-token");
          setApiToken(null);
          set({ token: null, isAuthenticated: false, isLoading: false, user: null });
        }
      },
      getProfile: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const response = await authAPI.getProfile(token);
          const user = response?.data?.user || response?.user || response;
          set({ user });
        } catch (error) {
          console.error("Error obteniendo perfil", error);
        }
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: async (name) => {
          const value = await SecureStore.getItemAsync(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await SecureStore.setItemAsync(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await SecureStore.deleteItemAsync(name);
        },
      },
    }
  )
);
