import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { LogBox, Text, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// 개발 중 화면에 뜨는 빨간/노란 에러·경고 오버레이를 끈다.
// LogBox.ignoreAllLogs(true);

// 기기의 시스템 글자 크기(접근성) 설정이 커도 고정 padding/height로 짜인
// 레이아웃이 깨지지 않도록, 폰트 확대는 허용하되 배율 상한을 둔다.
// (완전히 꺼버리면 접근성이 필요한 사용자에게 불리하므로 0으로 두지 않음)
(Text as unknown as { defaultProps: Record<string, unknown> }).defaultProps = {
  ...(Text as unknown as { defaultProps?: Record<string, unknown> }).defaultProps,
  maxFontSizeMultiplier: 1.3,
};
(TextInput as unknown as { defaultProps: Record<string, unknown> }).defaultProps = {
  ...(TextInput as unknown as { defaultProps?: Record<string, unknown> })
    .defaultProps,
  maxFontSizeMultiplier: 1.3,
};

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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
