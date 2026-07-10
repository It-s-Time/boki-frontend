import { useRouter, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingScreen from '@/shared/components/LoadingScreen';
import ReportDetail from '@/features/review/components/ReportDetail';
import { useAiReport } from '@/features/review/hooks/useAiReport';
import { COLORS_NEW } from '@/shared/constants/colors';

export default function AiReportScreen() {
  const router = useRouter();
  const { tradeId } = useLocalSearchParams<{ tradeId: string }>();
  const numericTradeId = tradeId ? Number(tradeId) : undefined;

  const { data: report, isLoading, isError, refetch } = useAiReport(numericTradeId);

  if (isLoading || report?.status === 'PENDING') {
    return <LoadingScreen message="AI가 피드백을 만들고 있어요" />;
  }

  if (isError || !report) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top', 'bottom']}>
        <Text style={styles.errorText}>리포트를 불러오지 못했어요</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>다시 시도</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <ReportDetail report={report} onBack={() => router.replace('/(tabs)/journal')} />
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
  },
  retryButton: {
    backgroundColor: COLORS_NEW.fab,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  retryText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
  },
});
