import { COLORS_NEW } from '@/shared/constants/colors';
import { Principle, PrincipleAnswer } from '@/features/review/types';
import { PRINCIPLE_ILLUSTRATIONS, PRINCIPLE_SETS } from '@/features/review/data';
import { useRuleSets } from '@/features/review/hooks/useRuleSets';
import { useCreateReview } from '@/features/review/hooks/useReview';
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

const ILLUSTRATION_HEIGHT = 190;

// RN's line breaker can split inside a single 어절 (e.g. "사기" -> "사" / "기")
// since Hangul syllables are individually breakable by default. Joining each
// word's characters with a zero-width word joiner blocks breaks there while
// leaving the real spaces between words breakable.
function keepWordsTogether(text: string) {
  return text
    .split(' ')
    .map((word) => [...word].join('⁠'))
    .join(' ');
}

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

  const { data, isLoading: isPrincipleSetsLoading } = useRuleSets('template');
  // Fall back to the local template set until the backend has TEMPLATE rule sets seeded.
  const principleSets = data && data.length > 0 ? data : PRINCIPLE_SETS;
  const principleSet = principleSets.find((s) => s.id === principleSetId);
  const principles: Principle[] = (principleSet?.principles ?? []).filter(
    (p) => p.type === tradeType,
  );
  const total = principles.length;

  const createReview = useCreateReview();

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
    const usingBackendRuleSets = Boolean(data && data.length > 0);
    const reviewData = {
      ruleSetId: Number(principleSetId),
      scores: principles.map((p, i) => ({
        ruleId: Number(p.id),
        score: Number(answers[i].score),
      })),
      content: memo.content,
      replaceImages: false,
      images: memo.photos,
    };
    console.log('[Review] submitting', {
      usingBackendRuleSets,
      principleSetId,
      ruleSetId: reviewData.ruleSetId,
      scores: reviewData.scores,
    });
    createReview.mutate(
      {
        tradeId: Number(tradeId),
        data: reviewData,
      },
      {
        onSuccess: () => {
          router.replace({
            pathname: '/review/confirm',
            params: { tradeId },
          });
        },
        onError: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      router.back();
    }
  };

  if (isSubmitting) {
    return <LoadingScreen message="복기를 저장하고 있어요" />;
  }

  if (isPrincipleSetsLoading) {
    return <LoadingScreen message="매매원칙을 불러오고 있어요" />;
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
        <Text
          style={styles.principleContent}
          lineBreakStrategyIOS="hangul-word"
        >
          {keepWordsTogether(currentPrinciple.content)}
        </Text>

        <View style={styles.illustrationArea}>
          {illustration && (
            <illustration.Icon
              width={illustration.width * (ILLUSTRATION_HEIGHT / illustration.height)}
              height={ILLUSTRATION_HEIGHT}
            />
          )}
        </View>

        <ScoreSelector
          value={currentAnswer.score}
          onChange={(n) => updateAnswer({ score: n })}
        />
      </View>

      {createReview.isError && (
        <Text style={styles.submitError}>
          복기 저장에 실패했어요, 다시 시도해주세요
        </Text>
      )}

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
    letterSpacing: -1.04,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    paddingHorizontal: 22,
    lineHeight: 30,
    textAlign: 'center',
  },

  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -30,
  },

  button: {
    marginTop: 24,
  },

  submitError: {
    color: COLORS_NEW.downStrong,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    letterSpacing: -0.56,
    textAlign: 'center',
    marginTop: 12,
  },
});
