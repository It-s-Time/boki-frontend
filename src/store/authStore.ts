import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

interface AuthUser {
  memberId: number;
  email: string;
  provider: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  setAuth: (params: {
    accessToken: string;
    refreshToken: string;
    memberId: number;
    email: string;
    provider: string;
  }) => Promise<void>;
  loadAuth: () => Promise<void>;
  clearAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,

  setAuth: async ({ accessToken, refreshToken, memberId, email, provider }) => {
    const user = { memberId, email, provider };
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    set({ accessToken, refreshToken, user });
  },

  loadAuth: async () => {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    const userJson = await SecureStore.getItemAsync(USER_KEY);
    if (accessToken && refreshToken) {
      const user = userJson ? JSON.parse(userJson) : null;
      set({ accessToken, refreshToken, user });
    }
  },

  clearAuth: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
