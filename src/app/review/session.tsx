import { COLORS } from '@/shared/constants/colors';
import {
  Principle,
  PrincipleAnswer,
  PrincipleSet,
} from '@/features/review/types';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
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
  const { tradeId, principleSetId } = useLocalSearchParams<{
    tradeId: string;
    principleSetId: string;
  }>();

  const principleSet = MOCK_PRINCIPLE_SETS.find((s) => s.id === principleSetId);
  const principles: Principle[] = principleSet?.principles ?? [];
  const total = principles.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<PrincipleAnswer[]>(
    principles.map((p) => ({
      principleId: p.id,
      score: null,
      reviewContent: '',
      links: [],
      photos: [],
    })),
  );
  const scrollRef = useRef<ScrollView>(null);

  const currentPrinciple = principles[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isLast = currentIndex === total - 1;

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

  if (!principleSet || !currentPrinciple) {
    return null;
  }

  const principleLabel =
    currentPrinciple.type === 'buy'
      ? `매수 원칙 ${currentPrinciple.order}`
      : `매도 원칙 ${currentPrinciple.order}`;

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

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 원칙 정보 */}
        <View style={styles.principleSection}>
          <Text style={styles.principleLabel}>{principleLabel}</Text>
          <Text style={styles.principleContent}>
            {currentPrinciple.content}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* 원칙 준수 점수 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            원칙 준수 점수 <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.scoreRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable
                key={n}
                style={[
                  styles.scoreCircle,
                  currentAnswer.score === n && styles.scoreCircleSelected,
                ]}
                onPress={() => updateAnswer({ score: n })}
              >
                <Text
                  style={[
                    styles.scoreText,
                    currentAnswer.score === n && styles.scoreTextSelected,
                  ]}
                >
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.scoreLabels}>
            <Text style={styles.scoreLabel}>전혀 안 지킴</Text>
            <Text style={styles.scoreLabel}>완벽히 지킴</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 복기 내용 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>복기 내용 작성하기</Text>
          <Text style={styles.sectionDesc}>
            매매원칙과 관련하여 자유롭게 복기내용을 작성해주세요.
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="복기 내용을 작성해주세요."
            placeholderTextColor={COLORS.iconBox}
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
                size={22}
                color={COLORS.textSecondary}
              />
            </Pressable>
          </View>
          {currentAnswer.links.length > 0 && (
            <View style={styles.linkCard}>
              <View style={styles.linkThumb} />
              <View style={styles.linkInfo}>
                <Text style={styles.linkTitle}>제목</Text>
                <Text style={styles.linkSummary} numberOfLines={2}>
                  링크 요약 문장 작성할 곳.
                </Text>
                <Text style={styles.linkGo}>바로가기 →</Text>
              </View>
            </View>
          )}
          {currentAnswer.links.length === 0 && (
            <Text style={styles.emptyHint}>링크를 추가해보세요.</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* 사진 추가 */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>사진 추가</Text>
            <Pressable style={styles.addButton}>
              <Ionicons
                name="add-circle"
                size={22}
                color={COLORS.textSecondary}
              />
            </Pressable>
          </View>
          <View style={styles.photoGrid}>
            {currentAnswer.photos.map((uri, idx) => (
              <View key={idx} style={styles.photoBox}>
                <Image source={{ uri }} style={styles.photoImage} />
                <Pressable
                  style={styles.photoRemove}
                  onPress={() =>
                    updateAnswer({
                      photos: currentAnswer.photos.filter((_, i) => i !== idx),
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
            {currentAnswer.photos.length < 4 &&
              Array.from({ length: 4 - currentAnswer.photos.length }).map(
                (_, idx) => (
                  <View key={`empty-${idx}`} style={styles.photoBoxEmpty} />
                ),
              )}
          </View>
        </View>
      </ScrollView>

      {/* 다음 / 완료 버튼 */}
      <Pressable style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>{isLast ? '완료' : '다음'}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function ProgressBar({ total, current }: { total: number; current: number }) {
  return (
    <View style={progressStyles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            progressStyles.segment,
            i <= current
              ? progressStyles.segmentFilled
              : progressStyles.segmentEmpty,
            i < total - 1 && progressStyles.segmentGap,
          ]}
        />
      ))}
    </View>
  );
}

const progressStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 8,
  },
  segmentFilled: {
    backgroundColor: COLORS.textSecondary,
  },
  segmentEmpty: {
    backgroundColor: COLORS.iconBox,
  },
  segmentGap: {},
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  backButton: {
    marginLeft: 12,
    marginRight: 14,
    padding: 4,
  },

  title: {
    fontSize: 24,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  principleSection: {
    paddingVertical: 8,
    marginBottom: 16,
  },

  principleLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 6,
  },

  principleContent: {
    fontSize: 20,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: 28,
  },

  divider: {
    height: 0.5,
    backgroundColor: '#D0D0D1',
    marginVertical: 20,
  },

  section: {
    gap: 8,
  },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  sectionTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  required: {
    color: '#EE5A4B',
  },

  sectionDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 20,
  },

  addButton: {
    padding: 2,
  },

  scoreRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },

  scoreCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.iconBox,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.box,
  },

  scoreCircleSelected: {
    borderColor: COLORS.textSecondary,
    backgroundColor: COLORS.textSecondary,
  },

  scoreText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  scoreTextSelected: {
    color: '#FFFFFF',
  },

  scoreLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  scoreLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
  },

  textInput: {
    backgroundColor: COLORS.box,
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    minHeight: 120,
    lineHeight: 22,
  },

  emptyHint: {
    fontSize: 13,
    color: COLORS.iconBox,
    fontFamily: 'Pretendard-Regular',
    paddingVertical: 4,
  },

  linkCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.box,
    borderRadius: 8,
    overflow: 'hidden',
  },

  linkThumb: {
    width: 88,
    height: 80,
    backgroundColor: COLORS.iconBox,
  },

  linkInfo: {
    flex: 1,
    padding: 10,
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
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    alignSelf: 'flex-end',
  },

  photoGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },

  photoBox: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },

  photoImage: {
    width: '100%',
    height: '100%',
  },

  photoRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
  },

  photoBoxEmpty: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.iconBox,
  },

  nextButton: {
    marginHorizontal: 24,
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textSecondary,
  },

  nextButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-SemiBold',
  },
});
