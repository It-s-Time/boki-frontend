import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Pretendard-Light': require('../../assets/fonts/Pretendard-Light.ttf'),
    'Pretendard-Regular': require('../../assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('../../assets/fonts/Pretendard-Bold.ttf'),
  });
  const [authReady, setAuthReady] = useState(false);
  const loadAuth = useAuthStore((state) => state.loadAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    loadAuth().finally(() => setAuthReady(true));
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (accessToken) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/signup');
    }
  }, [authReady]); // accessToken 제거: 로그인 중 이중 navigation 방지

  if (!loaded || !authReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
