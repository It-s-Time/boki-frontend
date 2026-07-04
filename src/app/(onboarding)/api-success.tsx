import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/shared/constants/colors';
import Button from '@/shared/components/Button';
import Logo from '../../../assets/icons/logo.svg';

export default function ApiSuccessScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoSection}>
          <Logo width={204} height={80} />
          <Text style={styles.title}>
            업비트 API 연동이{'\n'}성공적으로 마무리되었어요!
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            label="홈으로 이동하기"
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    gap: 28,
    paddingBottom: 100,
  },
  title: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 32,
  },
  footer: {
    position: 'absolute',
    bottom: 200,
    left: 24,
    right: 24,
    gap: 16,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Mediuim',
    fontSize: 16,
    textAlign: 'center',
  },
});
