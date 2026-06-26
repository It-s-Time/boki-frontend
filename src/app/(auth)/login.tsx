import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/shared/constants/colors';
import { useSocialLogin } from '@/features/auth/hooks/useSocialLogin';

export default function LoginScreen() {
  const { login, isLoading } = useSocialLogin();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoArea}>
        <Text style={styles.appName}>BOKI</Text>
        <Text style={styles.tagline}>나만의 매매일지</Text>
      </View>

      <View style={styles.buttonArea}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <>
            <Pressable style={styles.kakaoButton} onPress={() => login('kakao')}>
              <Text style={styles.kakaoText}>카카오로 시작하기</Text>
            </Pressable>

            <Pressable style={styles.googleButton} onPress={() => login('google')}>
              <Text style={styles.googleText}>구글로 시작하기</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  logoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 48,
    fontFamily: 'Pretendard-Bold',
    color: COLORS.textPrimary,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: COLORS.textSecondary,
  },
  buttonArea: {
    gap: 12,
    paddingBottom: 16,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  kakaoText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#191600',
  },
  googleButton: {
    backgroundColor: COLORS.box,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  googleText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: COLORS.textPrimary,
  },
});
