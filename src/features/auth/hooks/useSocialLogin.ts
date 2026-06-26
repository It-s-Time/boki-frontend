import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { exchangeLoginCode } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

const REDIRECT_URI = 'boki://auth/callback';

type Provider = 'kakao' | 'google';

export function useSocialLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (provider: Provider) => {
    setIsLoading(true);
    try {
      const loginUrl = `${process.env.EXPO_PUBLIC_API_URL}/auth/oauth2/${provider}?redirectUri=${encodeURIComponent(REDIRECT_URI)}`;

      const result = await WebBrowser.openAuthSessionAsync(loginUrl, REDIRECT_URI);

      if (result.type !== 'success') return;

      const url = new URL(result.url);
      const loginCode = url.searchParams.get('loginCode');
      if (!loginCode) return;

      const authData = await exchangeLoginCode(loginCode);
      await setAuth(authData);

      router.replace('/(tabs)');
    } catch (e) {
      console.error('소셜 로그인 실패:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => setIsLoading(false);

  return { login, isLoading, reset };
}
