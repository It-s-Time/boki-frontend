import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import LoadingScreen from '@/shared/components/LoadingScreen';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const loadAuth = useAuthStore((state) => state.loadAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    loadAuth().then(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (!isReady) return;
    router.replace(accessToken ? '/(tabs)' : '/(auth)/signup');
  }, [isReady, accessToken]);

  return <LoadingScreen />;
}
