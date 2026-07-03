import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';

const REDIRECT_URI = 'boki://auth/callback';
type Provider = 'kakao' | 'google';

export function useSocialLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (provider: Provider) => {
    setIsLoading(true);
    const loginUrl = `${process.env.EXPO_PUBLIC_API_URL}/auth/oauth2/${provider}?redirectUri=${encodeURIComponent(REDIRECT_URI)}`;
    try {
      await WebBrowser.openBrowserAsync(loginUrl);
    } catch (e) {
      console.error('브라우저 열기 실패:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => setIsLoading(false);
  return { login, isLoading, reset };
}
