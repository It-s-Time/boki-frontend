import { COLORS_NEW } from '@/shared/constants/colors';
import { Principle, PrincipleAnswer } from '@/features/review/types';
import {
  PRINCIPLE_SETS,
  PRINCIPLE_ILLUSTRATIONS,
} from '@/features/review/data';
import ProgressBar from '@/features/review/components/ProgressBar';
import ScoreSelector from '@/features/review/components/ScoreSelector';
import ReviewMemoModal, {
  ReviewMemo,
} from '@/features/review/components/ReviewMemoModal';
import BackHeader from '@/shared/components/BackHeader';
import PrimaryButton from '@/shared/components/PrimaryButton';
import LoadingScreen from '@/shared/components/LoadingScreen';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReviewSessionScreen() {
  const router = useRouter();
  const {
    tradeId,
    principleSetId,
    coinName,
    symbol,
    amount,
    tradeType,
    time,
    price,
  } = useLocalSearchParams<{
    tradeId: string;
    principleSetId: string;
    coinName: string;
    symbol: string;
    amount: string;
    tradeType: string;
    time: string;
    price: string;
  }>();

  const principleSet = PRINCIPLE_SETS.find((s) => s.id === principleSetId);
  const principles: Principle[] = (principleSet?.principles ?? []).filter(
    (p) => p.type === tradeType,
  );
  const total = principles.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<PrincipleAnswer[]>(
    principles.map((p) => ({
      principleId: p.id,
      score: null,
      reviewContent: '',
      links: [],
      photos: [],
    })),
  );

  const currentPrinciple = principles[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isLast = currentIndex === total - 1;
  const isNextEnabled = currentAnswer?.score !== null;

  const updateAnswer = (patch: Partial<PrincipleAnswer>) => {
    setAnswers((prev) =>
      prev.map((a, i) => (i === currentIndex ? { ...a, ...patch } : a)),
    );
  };

  const handleNext = () => {
    if (!isNextEnabled) return;
    if (isLast) {
      setShowMemoModal(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
  };

  const handleMemoSubmit = (memo: ReviewMemo) => {
    setShowMemoModal(false);
    setIsSubmitting(true);
    // TODO: replace this artificial delay with the real AI analysis API call.
    // TODO: once the review-create API is wired up, invalidate tradeKeys.all
    // (or the specific trade's query) here so reviewStatus/reviewId refresh from the server.
    // TODO: persist memo.content / memo.photos once the review result flow is wired back up
    setTimeout(() => {
      router.replace({ pathname: '/review/ai-report', params: { tradeId } });
    }, 1800);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      router.back();
    }
  };

  if (isSubmitting) {
    return <LoadingScreen message="AI가 피드백을 만들고 있어요" />;
  }

  if (!principleSet || !currentPrinciple) return null;

  const isBuy = tradeType === 'buy';
  const illustration =
    PRINCIPLE_ILLUSTRATIONS[isBuy ? 'buy' : 'sell'][currentPrinciple.order];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BackHeader title="매매원칙 준수 확인" onBack={handleBack} />

      <View style={styles.progressWrap}>
        <ProgressBar total={total} current={currentIndex} />
      </View>

      <View style={styles.principleContentWrap}>
        <Text style={styles.principleContent}>{currentPrinciple.content}</Text>

        <View style={styles.illustrationArea}>
          {illustration && (
            <illustration.Icon
              width={illustration.width}
              height={illustration.height}
            />
          )}
        </View>

        <ScoreSelector
          value={currentAnswer.score}
          onChange={(n) => updateAnswer({ score: n })}
        />
      </View>

      <PrimaryButton
        label={isLast ? '완료' : '다음'}
        onPress={handleNext}
        disabled={!isNextEnabled}
        style={styles.button}
      />

      <ReviewMemoModal
        visible={showMemoModal}
        onClose={() => setShowMemoModal(false)}
        onSubmit={handleMemoSubmit}
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

  progressWrap: {
    marginTop: 20,
  },

  principleContentWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 64,
  },

  principleContent: {
    fontSize: 26,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    paddingHorizontal: 22,
    lineHeight: 30,
    textAlign: 'center',
  },

  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    marginTop: 24,
  },
});
