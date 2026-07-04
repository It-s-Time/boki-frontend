import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, router, usePathname } from 'expo-router';
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
  const pathname = usePathname();

  useEffect(() => {
    loadAuth().finally(() => setAuthReady(true));
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (pathname === '/auth/callback') return;

    if (accessToken) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/signup');
    }
  }, [authReady, accessToken]); // pathname 변경 때 탭 이동을 덮어쓰지 않도록 제외

  if (!loaded || !authReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
