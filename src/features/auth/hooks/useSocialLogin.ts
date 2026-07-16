import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import {
  AUTH_REDIRECT_URI,
  isAuthCallbackUrl,
} from '@/features/auth/utils/socialLoginCallback';

type Provider = 'kakao' | 'google';

export function useSocialLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (provider: Provider) => {
    setIsLoading(true);
    const loginUrl = `${process.env.EXPO_PUBLIC_API_URL}/auth/oauth2/${provider}?redirectUri=${encodeURIComponent(AUTH_REDIRECT_URI)}`;

    try {
      // Linking listener와 openAuthSessionAsync 중 먼저 오는 쪽으로 "콜백 도착"만 감지한다.
      // 실제 로그인 코드 교환은 /auth/callback 라우트(AuthCallback)가 전담한다 — 여기서도
      // 교환을 시도하면 1회용 loginCode를 두 곳에서 소진하려다 401이 날 수 있다.
      await new Promise<void>((resolve) => {
        let settled = false;

        const finish = (cleanup?: () => void) => {
          if (settled) return;
          settled = true;
          cleanup?.();
          resolve();
        };

        // Android 딥링크 직접 수신
        const sub = Linking.addEventListener('url', ({ url }) => {
          if (isAuthCallbackUrl(url)) {
            finish(() => sub.remove());
          }
        });

        // Custom Tab에서 URL 인터셉트
        WebBrowser.openAuthSessionAsync(loginUrl, AUTH_REDIRECT_URI)
          .then((result) => {
            if (result.type === 'success') {
              finish(() => sub.remove());
            } else {
              // 딥링크 이벤트가 dismiss 직후에 올 수 있으므로 잠깐 대기
              setTimeout(() => finish(() => sub.remove()), 500);
            }
          })
          .catch(() => finish(() => sub.remove()));
      });

      // 혹시 Custom Tab이 아직 열려있으면 닫기
      WebBrowser.dismissBrowser?.()?.catch(() => {});
    } catch (e) {
      console.error('소셜 로그인 실패:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => setIsLoading(false);

  return { login, isLoading, reset };
}
