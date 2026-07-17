import { useRouter, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingScreen from '@/shared/components/LoadingScreen';
import ReportDetail from '@/features/review/components/ReportDetail';
import { useAiReport, useCreateAiReport } from '@/features/review/hooks/useAiReport';
import { useReview } from '@/features/review/hooks/useReview';
import { COLORS_NEW } from '@/shared/constants/colors';

export default function AiReportScreen() {
  const router = useRouter();
  const { tradeId, origin } = useLocalSearchParams<{
    tradeId: string;
    origin?: string;
  }>();
  const numericTradeId = tradeId ? Number(tradeId) : undefined;

  // Reached from journal/home to view an already-graded trade — pop back so
  // the caller's own state (e.g. journal's grade filter) is preserved.
  // Reached from the "복기 확인" confirm screen right after finishing a
  // review, though, that screen already replaced itself in history (see
  // confirm.tsx), so there's nothing meaningful to pop back to — land on
  // the journal list instead, same as confirm.tsx's own back button does.
  const handleBack =
    origin === 'confirm'
      ? () => router.replace('/(tabs)/journal')
      : () => router.back();

  const { data: report, isLoading, isError } = useAiReport(numericTradeId);
  const { data: review } = useReview(numericTradeId);
  const createAiReport = useCreateAiReport();

  if (isLoading || report?.status === 'PENDING' || createAiReport.isPending) {
    return <LoadingScreen message="AI가 피드백을 만들고 있어요" />;
  }

  if (isError || !report || report.status === 'FAILED') {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top', 'bottom']}>
        <Text style={styles.errorText}>리포트를 불러오지 못했어요</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => {
            if (numericTradeId !== undefined) {
              createAiReport.mutate(numericTradeId);
            }
          }}
        >
          <Text style={styles.retryText}>다시 시도</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return <ReportDetail report={report} review={review} onBack={handleBack} />;
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
    letterSpacing: -0.64,
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
    letterSpacing: -0.64,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
  },
});
