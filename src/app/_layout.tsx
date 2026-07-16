import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { LogBox } from 'react-native';

// 개발 중 화면에 뜨는 빨간/노란 에러·경고 오버레이를 끈다.
LogBox.ignoreAllLogs(true);

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Pretendard-Light': require('../../assets/fonts/Pretendard-Light.ttf'),
    'Pretendard-Regular': require('../../assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('../../assets/fonts/Pretendard-Bold.ttf'),
  });

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName="index"
      >
        <Stack.Screen
          name="(auth)/signup"
          options={{ animation: 'fade', animationDuration: 500 }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ animation: 'fade', animationDuration: 500 }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
