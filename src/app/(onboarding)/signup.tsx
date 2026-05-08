import { SafeAreaView, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

const GRAY = '#D9D9D9';

export default function SignupScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>코인투자를 위한 발걸음</Text>
          <Text style={styles.description}>회원가입을 진행해주세요!</Text>
        </View>

        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>logo</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.socialButton} onPress={() => router.push('/login-processing')}>
            <Text style={styles.socialButtonText}>카카오로 계속하기</Text>
          </Pressable>

          <Text style={styles.dividerText}>또는</Text>

          <Pressable style={styles.socialButton} onPress={() => router.push('/login-processing')}>
            <Text style={styles.socialButtonText}>구글로 계속하기</Text>
          </Pressable>

          <Text style={styles.termsText}>
            계속 진행하면 잇심동체의 <Text style={styles.termsLink}>이용약관</Text> 및{' '}
            <Text style={styles.termsLink}>개인정보처리방침</Text>에{'\n'}동의하는 것으로
            간주됩니다.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 48,
    paddingBottom: 42,
  },
  header: {
    position: 'absolute',
    top: 92,
    left: 31,
    right: 110,
    alignItems: 'flex-start',
  },
  title: {
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 30,
  },
  description: {
    marginTop: 12,
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 29,
  },
  logoSection: {
    flex: 1,
    paddingTop: 262,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 300,
  },
  logoCircle: {
    width: 238,
    height: 238,
    maxWidth: '72%',
    maxHeight: '72%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 119,
    backgroundColor: GRAY,
    aspectRatio: 1,
  },
  logoText: {
    color: '#000000',
    fontFamily: 'Pretendard-Bold',
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 54,
  },
  footer: {
    position: 'absolute',
    top: 582,
    left: 48,
    right: 48,
    alignItems: 'center',
  },
  socialButton: {
    width: '92%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GRAY,
  },
  socialButtonText: {
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
  },
  dividerText: {
    marginVertical: 15,
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 28,
  },
  termsText: {
    marginTop: 26,
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 17,
    textAlign: 'center',
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});
