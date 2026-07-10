import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import Symbol from '../../../assets/symbol.svg';
import LogoText from '../../../assets/logo2.svg';
import GoogleIcon from '../../../assets/icons/google.svg';
import KakaoIcon from '../../../assets/icons/kakao.svg';
import { COLORS_NEW } from '@/shared/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingScreen from '@/shared/components/LoadingScreen';
import { useSocialLogin } from '@/features/auth/hooks/useSocialLogin';

const KAKAO_YELLOW = '#FBE300';

export default function SignupScreen() {
  const { login, isLoading, reset } = useSocialLogin();
  const [navigating, setNavigating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      reset();
      setNavigating(false);
    }, []),
  );

  const handleTaglinePress = () => {
    setNavigating(true);
    setTimeout(() => {
      router.push('/(onboarding)/setup-principles');
    }, 1500);
  };

  if (isLoading) return <LoadingScreen message="로그인 처리 중이에요" />;
  if (navigating) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoSection}>
          <View style={styles.logoRow}>
            <Symbol width={60} height={60} />
            <LogoText width={140} height={60} />
          </View>
          <Pressable onPress={handleTaglinePress}>
            <Text style={styles.tagline}>코인 투자를 위한 한 걸음</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={styles.googleButton}
            onPress={() => login('google')}
          >
            <GoogleIcon width={20} height={20} />
            <Text style={styles.googleLabel}>구글로 시작하기</Text>
          </Pressable>

          <Pressable style={styles.kakaoButton} onPress={() => login('kakao')}>
            <KakaoIcon width={24} height={24} />
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
    paddingBottom: 60,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  tagline: {
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    marginTop: 32,
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
    gap: 12,
    backgroundColor: COLORS_NEW.lightGray,
    borderRadius: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#D0D0D1',
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
    gap: 8,
    backgroundColor: KAKAO_YELLOW,
    borderRadius: 20,
    paddingVertical: 18,
    marginTop: 20,
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
    marginBottom: 64,
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});
