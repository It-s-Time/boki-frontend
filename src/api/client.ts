import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@/store/authStore';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

type RetryableRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

let reissueTask: Promise<string | null> | null = null;

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

const reissueAccessToken = async () => {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  const { data } = await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/reissue`,
    { refreshToken },
    { timeout: 10000 },
  );

  const result = data?.result;
  if (!data?.isSuccess || !result?.accessToken || !result?.refreshToken) {
    return null;
  }

  await useAuthStore.getState().setAuth(result);
  return result.accessToken as string;
};

apiClient.interceptors.request.use(async (config) => {
  const isAuthEndpoint = config.url?.startsWith('/auth/');
  if (!isAuthEndpoint) {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      // Errors thrown before dispatch (e.g. the request interceptor's
      // SecureStore read) never become AxiosErrors, so log them too —
      // otherwise they fail completely silently.
      console.error('[API] request failed before reaching the network:', error);
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isAuthEndpoint = originalRequest?.url?.startsWith('/auth/');

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint
    ) {
      console.error(
        `[API] ${error.config?.method?.toUpperCase()} ${error.config?.url} failed (${error.response?.status ?? error.code}):`,
        error.response?.data ?? error.message,
      );
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      reissueTask ??= reissueAccessToken().finally(() => {
        reissueTask = null;
      });

      const accessToken = await reissueTask;
      if (!accessToken) {
        await useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }

      originalRequest.headers = {
        ...(originalRequest.headers as Record<string, string> | undefined),
        Authorization: `Bearer ${accessToken}`,
      };

      return apiClient(originalRequest);
    } catch {
      await useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }
  },
);
