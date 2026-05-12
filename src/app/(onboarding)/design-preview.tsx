import LoadingScreen from '@/shared/components/LoadingScreen';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function DesignPreviewScreen() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.replace('/api-success');
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  return <LoadingScreen message="API가 연동되고 있어요!" />;
}
