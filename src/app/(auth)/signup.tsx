import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import Logo from '../../../assets/logo.svg';
import { COLORS } from '@/shared/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/shared/components/Button';
import LoadingScreen from '@/shared/components/LoadingScreen';
import { useSocialLogin } from '@/features/auth/hooks/useSocialLogin';

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
          <Logo width={204} height={80} />
          <Text style={styles.tagline}>코인 투자를 위한 한 걸음</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.subtitle}>회원가입을 진행해주세요</Text>

          <Button
            label="카카오로 계속하기"
            variant="secondary"
            onPress={() => login('kakao')}
          />

          <Text style={styles.divider}>또는</Text>

          <Button
            label="구글로 계속하기"
            variant="secondary"
            onPress={() => login('google')}
          />

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
    backgroundColor: COLORS.box,
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
    gap: 24,
    paddingBottom: 120,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    marginTop: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 36,
    left: 24,
    right: 24,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  divider: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
  termsText: {
    marginTop: 24,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});
