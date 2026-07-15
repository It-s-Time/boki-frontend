import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

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
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error(
        `[API] ${error.config?.method?.toUpperCase()} ${error.config?.url} failed (${error.response?.status ?? error.code}):`,
        error.response?.data ?? error.message,
      );
    } else {
      // Errors thrown before dispatch (e.g. the request interceptor's
      // SecureStore read) never become AxiosErrors, so log them too —
      // otherwise they fail completely silently.
      console.error('[API] request failed before reaching the network:', error);
    }
    return Promise.reject(error);
  },
);
