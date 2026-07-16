import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS_NEW } from '@/shared/constants/colors';
import BackHeader from '@/shared/components/BackHeader';
import PrimaryButton from '@/shared/components/PrimaryButton';
import LoadingScreen from '@/shared/components/LoadingScreen';
import { useReview } from '@/features/review/hooks/useReview';
import { useCreateAiReport } from '@/features/review/hooks/useAiReport';

export default function ReviewConfirmScreen() {
  const router = useRouter();
  const { tradeId } = useLocalSearchParams<{ tradeId: string }>();
  const numericTradeId = tradeId ? Number(tradeId) : undefined;

  const { data: review, isLoading, isError, refetch } = useReview(numericTradeId);
  const createAiReport = useCreateAiReport();

  const handleViewReport = () => {
    if (numericTradeId === undefined) return;
    createAiReport.mutate(numericTradeId, {
      onSuccess: () => {
        router.replace({ pathname: '/review/ai-report', params: { tradeId } });
      },
    });
  };

  if (createAiReport.isPending) {
    return <LoadingScreen message="AI가 피드백을 만들고 있어요" />;
  }

  if (isLoading) {
    return <LoadingScreen message="복기 내용을 불러오고 있어요" />;
  }

  if (isError || !review) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top', 'bottom']}>
        <Text style={styles.errorText}>복기를 불러오지 못했어요</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>다시 시도</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BackHeader
        title="복기 확인"
        onBack={() => router.replace('/(tabs)/journal')}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>원칙별 점수</Text>
          {review.scores.map((score) => (
            <View key={score.ruleId} style={styles.scoreRow}>
              <Text style={styles.scoreContent}>{score.ruleContent}</Text>
              <View style={styles.scoreChip}>
                <Text style={styles.scoreChipText}>{score.score}/5</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>메모</Text>
          <Text style={styles.memoText}>
            {review.content || '작성된 메모가 없어요'}
          </Text>

          {review.imageUrls.length > 0 && (
            <View style={styles.photoRow}>
              {review.imageUrls.map((url) => (
                <Image key={url} source={{ uri: url }} style={styles.photo} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {createAiReport.isError && (
        <Text style={styles.submitError}>
          리포트 생성에 실패했어요, 다시 시도해주세요
        </Text>
      )}

      <PrimaryButton
        label="AI 리포트 보기"
        onPress={handleViewReport}
        style={styles.button}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },

  scroll: {
    flex: 1,
    marginHorizontal: -24,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 16,
  },

  card: {
    backgroundColor: COLORS_NEW.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    padding: 20,
  },

  cardTitle: {
    fontSize: 18,
    letterSpacing: -0.72,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 14,
  },

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    gap: 12,
  },

  scoreContent: {
    flex: 1,
    fontSize: 15,
    letterSpacing: -0.6,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
  },

  scoreChip: {
    backgroundColor: COLORS_NEW.lightGray,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  scoreChipText: {
    fontSize: 13,
    letterSpacing: -0.52,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Medium',
  },

  memoText: {
    fontSize: 15,
    letterSpacing: -0.6,
    lineHeight: 22,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
  },

  photoRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  photo: {
    width: 72,
    height: 72,
    borderRadius: 16,
  },

  button: {
    marginTop: 8,
  },

  submitError: {
    color: COLORS_NEW.downStrong,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    letterSpacing: -0.56,
    textAlign: 'center',
    marginBottom: 12,
  },

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
