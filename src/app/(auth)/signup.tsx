import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import Symbol from '../../../assets/symbol.svg';
import LogoText from '../../../assets/logo2.svg';
import GoogleIcon from '../../../assets/icons/google.svg';
import { COLORS_NEW } from '@/shared/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingScreen from '@/shared/components/LoadingScreen';
import { useSocialLogin } from '@/features/auth/hooks/useSocialLogin';

const KAKAO_YELLOW = '#FFDC00';

export default function SignupScreen() {
  const { login, isLoading, reset } = useSocialLogin();

  useFocusEffect(
    useCallback(() => {
      reset();
    }, []),
  );

  if (isLoading) return <LoadingScreen message="로그인 처리 중이에요" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoSection}>
          <View style={styles.logoRow}>
            <Symbol width={48} height={48} />
            <LogoText width={128} height={48} />
          </View>
          <Text style={styles.tagline}>코인 투자를 위한 한 걸음</Text>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.googleButton} onPress={() => login('google')}>
            <GoogleIcon width={18} height={18} />
            <Text style={styles.googleLabel}>구글로 시작하기</Text>
          </Pressable>

          <Pressable style={styles.kakaoButton} onPress={() => login('kakao')}>
            <Text style={styles.kakaoIcon}>k</Text>
            <Text style={styles.kakaoLabel}>카카오로 시작하기</Text>
          </Pressable>

          <Text style={styles.termsText}>
            계속 진행하면 잇심동체의{' '}
            <Text style={styles.termsLink}>이용약관</Text> 및{' '}
            <Text style={styles.termsLink}>개인정보처리방침</Text>에{'\n'}
            동의하는 것으로 간주됩니다.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 120,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tagline: {
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 36,
    left: 24,
    right: 24,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS_NEW.lightGray,
    borderRadius: 999,
    paddingVertical: 16,
  },
  googleLabel: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
  },
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: KAKAO_YELLOW,
    borderRadius: 999,
    paddingVertical: 16,
    marginTop: 12,
  },
  kakaoIcon: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
  },
  kakaoLabel: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
  },
  termsText: {
    marginTop: 24,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});
