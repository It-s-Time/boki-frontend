import { COLORS } from '@/shared/constants/colors';
import {
  Principle,
  PrincipleAnswer,
  PrincipleSet,
} from '@/features/review/types';
import ProgressBar from '@/features/review/components/ProgressBar';
import ScoreSelector from '@/features/review/components/ScoreSelector';
import TradeInfoCard from '@/features/review/components/TradeInfoCard';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const MOCK_PRINCIPLE_SETS: PrincipleSet[] = [
  {
    id: '1',
    name: '나의 안정형 전략',
    description: '장기 보유 중심의 안정적인 투자 전략',
    createdAt: '2026.03.15',
    buyCount: 3,
    sellCount: 3,
    principles: [
      {
        id: 'b1',
        type: 'buy',
        order: 1,
        content: '기술적 분석 지표 3개 이상 확인하기',
      },
      {
        id: 'b2',
        type: 'buy',
        order: 2,
        content: '거래량이 평균 대비 150% 이상일 때만 진입',
      },
      {
        id: 'b3',
        type: 'buy',
        order: 3,
        content: '손절 라인 설정 후 매수 진행',
      },
      {
        id: 's1',
        type: 'sell',
        order: 1,
        content: '목표 수익률 도달 시 즉시 매도',
      },
      {
        id: 's2',
        type: 'sell',
        order: 2,
        content: '손절 라인 이탈 시 감정 없이 매도',
      },
      {
        id: 's3',
        type: 'sell',
        order: 3,
        content: '거래량 급감 시 분할 매도 검토',
      },
    ],
  },
  {
    id: '2',
    name: '나의 공격형 전략',
    description: '단기 트레이딩 중심의 수익 극대화 전략',
    createdAt: '2026.03.15',
    buyCount: 3,
    sellCount: 3,
    principles: [
      { id: 'b1', type: 'buy', order: 1, content: '단기 상승 모멘텀 확인' },
      { id: 'b2', type: 'buy', order: 2, content: '저항선 돌파 확인 후 진입' },
      {
        id: 'b3',
        type: 'buy',
        order: 3,
        content: '리스크 대비 수익 2:1 이상일 때만 매수',
      },
      {
        id: 's1',
        type: 'sell',
        order: 1,
        content: '고점 대비 5% 하락 시 매도',
      },
      {
        id: 's2',
        type: 'sell',
        order: 2,
        content: '뉴스 이벤트 전 포지션 정리',
      },
      {
        id: 's3',
        type: 'sell',
        order: 3,
        content: '수익 실현 후 재진입 기회 탐색',
      },
    ],
  },
  {
    id: '3',
    name: '나의 분산형 전략',
    description: '리스크 분산을 통한 안정적 수익 추구',
    createdAt: '2026.03.15',
    buyCount: 3,
    sellCount: 3,
    principles: [
      {
        id: 'b1',
        type: 'buy',
        order: 1,
        content: '섹터 분산 3개 이상 종목 선택',
      },
      {
        id: 'b2',
        type: 'buy',
        order: 2,
        content: '단일 종목 비중 20% 이하 유지',
      },
      {
        id: 'b3',
        type: 'buy',
        order: 3,
        content: '분할 매수로 평균 단가 관리',
      },
      {
        id: 's1',
        type: 'sell',
        order: 1,
        content: '목표 수익률 20% 도달 시 분할 매도',
      },
      { id: 's2', type: 'sell', order: 2, content: '비중 초과 종목 리밸런싱' },
      {
        id: 's3',
        type: 'sell',
        order: 3,
        content: '손실 종목 조기 정리로 손실 최소화',
      },
    ],
  },
];

export default function ReviewSessionScreen() {
  const router = useRouter();
  const { principleSetId, coinName, symbol, amount, tradeType, time, price } =
    useLocalSearchParams<{
      tradeId: string;
      principleSetId: string;
      coinName: string;
      symbol: string;
      amount: string;
      tradeType: string;
      time: string;
      price: string;
    }>();

  const principleSet = MOCK_PRINCIPLE_SETS.find((s) => s.id === principleSetId);
  const principles: Principle[] = (principleSet?.principles ?? []).filter(
    (p) => p.type === tradeType,
  );
  const total = principles.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<PrincipleAnswer[]>(
    principles.map((p) => ({
      principleId: p.id,
      score: null,
      reviewContent: '',
      links: [],
      photos: ['1', '2', '3', '4', '5'],
    })),
  );
  const scrollRef = useRef<ScrollView>(null);

  const currentPrinciple = principles[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isLast = currentIndex === total - 1;
  const isNextEnabled = currentAnswer.score !== null;
  const hasPrev = currentIndex > 0;

  const updateAnswer = (patch: Partial<PrincipleAnswer>) => {
    setAnswers((prev) =>
      prev.map((a, i) => (i === currentIndex ? { ...a, ...patch } : a)),
    );
  };

  const handleNext = () => {
    if (isLast) {
      // TODO: 복기 제출 API 호출
      router.back();
      return;
    }
    setCurrentIndex((i) => i + 1);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    } else {
      router.back();
    }
  };

  if (!principleSet || !currentPrinciple) return null;

  const isBuy = tradeType === 'buy';
  const principleLabel = `${isBuy ? '매수' : '매도'} 원칙 ${currentPrinciple.order}`;

  const formattedPrice = price ? Number(price).toLocaleString() + '원' : '';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.title}>{principleSet.name}</Text>
      </View>

      {/* 프로그레스 바 */}
      <ProgressBar total={total} current={currentIndex} />

      <View style={styles.scrollWrapper}>
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TradeInfoCard
            isBuy={isBuy}
            coinName={coinName ?? ''}
            amount={amount ?? ''}
            symbol={symbol ?? ''}
            time={time ?? ''}
            formattedPrice={formattedPrice}
          />

          {/* 원칙 */}
          <View style={styles.principleSection}>
            <View style={styles.principleHeader}>
              <Text style={styles.principleLabel}>{principleLabel}</Text>
              <Text style={styles.required}>*는 필수항목 입니다.</Text>
            </View>
            <Text style={styles.principleContent}>
              {currentPrinciple.content}
            </Text>
          </View>

          {/* 원칙 준수 점수 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              원칙 준수 점수 <Text style={styles.requiredStar}>*</Text>
            </Text>
            <ScoreSelector
              value={currentAnswer.score}
              onChange={(n) => updateAnswer({ score: n })}
            />
          </View>

          <View style={styles.divider} />

          {/* 복기 내용 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>복기 내용 작성하기</Text>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="매매원칙과 관련하여 자유롭게 복기내용을 작성해주세요."
              placeholderTextColor={COLORS.textSecondary}
              value={currentAnswer.reviewContent}
              onChangeText={(text) => updateAnswer({ reviewContent: text })}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.divider} />

          {/* 링크 추가 */}
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>링크 추가</Text>
              <Pressable style={styles.addButton}>
                <Ionicons
                  name="add-circle"
                  size={18}
                  color={COLORS.textSecondary}
                />
              </Pressable>
            </View>
            <View style={styles.linkCard}>
              <View style={styles.linkThumb} />
              <View style={styles.linkInfo}>
                <Text style={styles.linkTitle}>제목</Text>
                <Text style={styles.linkSummary} numberOfLines={2}>
                  링크 요약 문장 작성할 곳. 링크 요약 문장 작성할 곳.
                </Text>
                <Text style={styles.linkGo}>바로가기 →</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 사진 추가 */}
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>사진 추가</Text>
              <Pressable style={styles.addButton}>
                <Ionicons
                  name="add-circle"
                  size={18}
                  color={COLORS.textSecondary}
                />
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photoRow}
            >
              {currentAnswer.photos.map((_, idx) => (
                <View key={idx} style={{ position: 'relative' }}>
                  <View style={styles.photoBoxEmpty} />
                  <Pressable
                    style={styles.photoRemove}
                    onPress={() =>
                      updateAnswer({
                        photos: currentAnswer.photos.filter(
                          (__, i) => i !== idx,
                        ),
                      })
                    }
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={COLORS.textSecondary}
                    />
                  </Pressable>
                </View>
              ))}
              {currentAnswer.photos.length === 0 && (
                <View style={{ position: 'relative' }}>
                  <View style={styles.photoBoxEmpty} />
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
        <View pointerEvents="none" style={styles.gradientBottom}>
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
            style={styles.fill}
          />
        </View>
      </View>

      {/* 이전 / 다음 버튼 */}
      <View style={styles.buttonRow}>
        {hasPrev && (
          <View style={styles.buttonCell}>
            <Pressable style={styles.prevButton} onPress={handleBack}>
              <Text style={styles.buttonText}>이전</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.buttonCell}>
          <Pressable
            style={[
              styles.nextButton,
              isNextEnabled
                ? styles.nextButtonEnabled
                : styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!isNextEnabled}
          >
            <Text style={styles.buttonText}>{isLast ? '완료' : '다음'}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.box,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backButton: {
    marginRight: 14,
    padding: 4,
  },

  title: {
    fontSize: 24,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  scrollWrapper: {
    flex: 1,
    overflow: 'hidden',
  },

  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },

  fill: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 16,
    paddingTop: 4,
  },

  principleSection: {
    marginBottom: 20,
  },

  principleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  principleLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
  },

  required: {
    fontSize: 12,
    color: '#EE5A4B',
    fontFamily: 'Pretendard-Regular',
  },

  principleContent: {
    fontSize: 20,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: 28,
  },

  divider: {
    height: 1,
    backgroundColor: '#D0D0D1',
    marginVertical: 20,
  },

  section: {
    gap: 8,
  },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  sectionTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  requiredStar: {
    color: '#EE5A4B',
  },

  addButton: {
    padding: 2,
  },

  textInput: {
    borderRadius: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    minHeight: 80,
    lineHeight: 22,
  },

  linkCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.box,
  },

  linkThumb: {
    width: 96,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.button,
  },

  linkInfo: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 4,
  },

  linkTitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  linkSummary: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 18,
  },

  linkGo: {
    fontSize: 12,
    color: COLORS.textPrimary,
    borderBottomColor: COLORS.textPrimary,
    borderBottomWidth: 0.5,
    fontFamily: 'Pretendard-Regular',
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },

  photoRow: {
    gap: 8,
  },

  photoBoxEmpty: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: COLORS.button,
  },

  photoRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
  },

  buttonRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 16,
  },

  buttonCell: {
    flex: 1,
  },

  prevButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.iconBox,
  },

  nextButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextButtonEnabled: {
    backgroundColor: COLORS.primary,
  },

  nextButtonDisabled: {
    backgroundColor: COLORS.iconBox,
  },

  buttonText: {
    fontSize: 20,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },
});
