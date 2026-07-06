import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import LoadingScreen from '@/shared/components/LoadingScreen';
import {
  completeLoginWithCode,
  getLoginCodeFromCallbackUrl,
} from '@/features/auth/utils/socialLoginCallback';

export default function AuthCallback() {
  const params = useLocalSearchParams<{ loginCode?: string | string[] }>();

  useEffect(() => {
    let isMounted = true;

    const finishLogin = async () => {
      WebBrowser.dismissBrowser?.()?.catch(() => {});

      const paramLoginCode = Array.isArray(params.loginCode)
        ? params.loginCode[0]
        : params.loginCode;
      const initialUrl = await Linking.getInitialURL();
      const initialLoginCode = initialUrl
        ? getLoginCodeFromCallbackUrl(initialUrl)
        : null;
      const loginCode = paramLoginCode ?? initialLoginCode;

      if (!loginCode) {
        if (isMounted) router.replace('/(auth)/signup');
        return;
      }

      await completeLoginWithCode(loginCode);
    };

    finishLogin().catch((error) => {
      console.error('소셜 로그인 콜백 처리 실패:', error);
      if (isMounted) router.replace('/(auth)/signup');
    });

    return () => {
      isMounted = false;
    };
  }, [params.loginCode]);

  return <LoadingScreen message="로그인 처리 중이에요" />;
}
