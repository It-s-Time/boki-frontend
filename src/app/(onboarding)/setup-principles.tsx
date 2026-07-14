import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS_NEW } from '@/shared/constants/colors';
import BackHeader from '@/shared/components/BackHeader';
import LoadingScreen from '@/shared/components/LoadingScreen';
import PrimaryButton from '@/shared/components/PrimaryButton';
import ProgressBar from '@/features/review/components/ProgressBar';
import PrincipleTypeAccordion from '@/features/onboarding/components/PrincipleTypeAccordion';
import PrincipleSetPreviewList from '@/features/onboarding/components/PrincipleSetPreviewList';
import PrincipleReviewCarousel from '@/features/onboarding/components/PrincipleReviewCarousel';
import FeedbackPreviewBox from '@/features/onboarding/components/FeedbackPreviewBox';

const TOTAL_STEPS = 4;
const SCREEN_HORIZONTAL_PADDING = 24;

export default function SetupPrinciplesScreen() {
  const [step, setStep] = useState(0);
  const [groupBoxHeight, setGroupBoxHeight] = useState<number | null>(null);
  const [navigating, setNavigating] = useState(false);

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }
    setNavigating(true);
    setTimeout(() => {
      // TODO: point at '/(tabs)' once this flow runs after real login —
      // for now there's no session yet, so it can't drop into the service.
      router.replace('/(auth)/signup');
    }, 3000);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
      return;
    }
    router.back();
  };

  if (navigating) {
    return <LoadingScreen message="이제 시작해볼까요?" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerWrap}>
        <BackHeader onBack={handleBack} />
      </View>

      <View style={styles.progressWrap}>
        <ProgressBar total={TOTAL_STEPS} current={step} />
      </View>

      <View style={styles.body}>
        {step === 0 ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>보키가 제공하는 매매원칙이에요</Text>
            <PrincipleTypeAccordion />
          </ScrollView>
        ) : step === 1 ? (
          <View style={styles.content}>
            <Text style={styles.title}>매매원칙을 설정해 보세요</Text>
            <PrincipleSetPreviewList
              active={step === 1}
              onHeightChange={setGroupBoxHeight}
            />
            <Text style={styles.helperText}>
              본인의 코인 매매 스타일에 맞게
              {'\n'}
              자유롭게 설정해주세요. 추후 수정도 가능합니다.
            </Text>
          </View>
        ) : step === 2 ? (
          <View style={styles.content}>
            <Text style={styles.title}>매매원칙을 바탕으로 복기해 보세요</Text>
            <PrincipleReviewCarousel active={step === 2} height={groupBoxHeight} />
            <Text style={styles.helperText}>
              매매원칙을 제대로 지켰는지 점수를 매겨주세요.
              {'\n'}
              솔직하게 답변하실 수록 투자 실력에 도움이 됩니다.
            </Text>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.title}>복기 내용 피드백을 받아보세요</Text>
            <FeedbackPreviewBox active={step === 3} height={groupBoxHeight} />
            <Text style={styles.helperText}>
              원칙을 얼마나 지켰는지 AI가 피드백을 제공합니다.
              {'\n'}
              앞으로 필요한 원칙 또한 제공합니다.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="다음" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
  },
  headerWrap: {
    paddingTop: 20,
  },
  progressWrap: {
    marginTop: 20,
  },
  body: {
    flex: 1,
    marginTop: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  content: {
    paddingVertical: 20,
  },
  title: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 24,
    marginBottom: 28,
  },
  helperText: {
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    fontSize: 18,
    lineHeight: 28,
    marginTop: 32,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 24,
    paddingTop: 8,
  },
});
