import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/shared/constants/colors';
import Button from '@/shared/components/Button';

export default function ApiFailScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.center}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>!</Text>
          </View>
          <Text style={styles.title}>업비트 API 연동이{'\n'}실패했습니다.</Text>
        </View>

        <View style={styles.footer}>
          <Button
            label="다시 시도"
            onPress={() => router.replace('/api-key')}
          />
          <Text style={styles.divider}>또는</Text>
          <Button
            label="수동 입력으로 시작하기"
            onPress={() => router.replace('/input/manual')}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingBottom: 100,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.buyText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 72,
    fontFamily: 'Pretendard-Bold',
    lineHeight: 60,
  },
  title: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    lineHeight: 32,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    gap: 16,
  },
  divider: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});
