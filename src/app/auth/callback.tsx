import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { exchangeLoginCode } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

export default function AuthCallback() {
  const { loginCode } = useLocalSearchParams<{ loginCode: string }>();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    WebBrowser.dismissBrowser?.()?.catch(() => {});

    const code = Array.isArray(loginCode) ? loginCode[0] : loginCode;
    if (!code) {
      router.replace('/(auth)/signup');
      return;
    }

    exchangeLoginCode(code)
      .then(async (authData) => {
        await setAuth(authData);
        router.replace('/(tabs)');
      })
      .catch((e) => {
        console.error('토큰 교환 실패:', e);
        router.replace('/(auth)/signup');
      });
  }, []);

  return null;
}
