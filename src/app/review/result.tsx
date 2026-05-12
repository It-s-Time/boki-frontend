import { COLORS } from '@/shared/constants/colors';
import { PrincipleAnswer, PrincipleSet } from '@/features/review/types';
import ScreenHeader from '@/shared/components/ScreenHeader';
import Button from '@/shared/components/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 12;
const CARD_SIDE_PEEK = 28;
const CARD_WIDTH = SCREEN_WIDTH - CARD_SIDE_PEEK * 2;

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
        content: '분할 매도 전략적으로 사용하기',
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

export default function ReviewResultScreen() {
  const router = useRouter();
  const {
    principleSetId,
    tradeType,
    answers: answersJson,
  } = useLocalSearchParams<{
    principleSetId: string;
    tradeType: string;
    answers: string;
  }>();

  const answers: PrincipleAnswer[] = (() => {
    try {
      return JSON.parse(answersJson ?? '[]');
    } catch {
      return [];
    }
  })();

  const principleSet = MOCK_PRINCIPLE_SETS.find((s) => s.id === principleSetId);
  const principles = (principleSet?.principles ?? []).filter(
    (p) => p.type === tradeType,
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [cardAreaHeight, setCardAreaHeight] = useState(0);

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP),
    );
    setActiveIndex(index);
  };

  if (!principleSet) return null;

  const isBuy = tradeType === 'buy';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader
        title={principleSet.name}
        style={{ paddingHorizontal: 24 }}
      />

      <View style={styles.dotsRow}>
        {principles.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      <View
        style={styles.cardArea}
        onLayout={(e) => setCardAreaHeight(e.nativeEvent.layout.height)}
      >
        {cardAreaHeight > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_GAP}
            decelerationRate="fast"
            contentContainerStyle={styles.cardsContainer}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            style={{ height: cardAreaHeight }}
          >
            {principles.map((principle, i) => {
              const answer = answers[i];
              return (
                <View
                  key={principle.id}
                  style={[styles.card, { height: cardAreaHeight }]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardPrincipleLabel}>
                      {isBuy ? '매수' : '매도'} 원칙 {principle.order}
                    </Text>
                    <Text style={styles.cardPrincipleContent}>
                      {principle.content}
                    </Text>
                  </View>

                  <ScrollView
                    style={styles.cardBody}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.cardBodyContent}
                  >
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>원칙 준수 점수</Text>
                      <View style={styles.scoreRow}>
                        <View style={styles.scoreCircle}>
                          <Text style={styles.scoreNumber}>
                            {answer?.score ?? '-'}
                          </Text>
                        </View>
                        <Text style={styles.scoreUnit}>점</Text>
                      </View>
                    </View>
                    {(answer?.photos ?? []).length > 0 && (
                      <>
                        <View style={styles.divider} />
                        <View style={styles.section}>
                          {answer.photos.map((uri, pi) => (
                            <Image
                              key={pi}
                              source={{ uri }}
                              style={styles.photoBox}
                            />
                          ))}
                        </View>
                      </>
                    )}
                    {!!answer?.reviewContent && (
                      <>
                        <View style={styles.divider} />
                        <View style={styles.section}>
                          <Text style={styles.sectionTitle}>복기 내용</Text>
                          <Text style={styles.reviewText}>
                            {answer.reviewContent}
                          </Text>
                        </View>
                      </>
                    )}

                    {(answer?.links ?? []).length > 0 && (
                      <>
                        <View style={styles.divider} />
                        <View style={styles.section}>
                          <Text style={styles.sectionTitle}>첨부 링크</Text>
                          {answer.links.map((link, li) => (
                            <View key={li} style={styles.linkCard}>
                              <View style={styles.linkThumb} />
                              <View style={styles.linkInfo}>
                                <Text style={styles.linkTitle}>
                                  {link.title}
                                </Text>
                                <Text
                                  style={styles.linkSummary}
                                  numberOfLines={2}
                                >
                                  {link.summary}
                                </Text>
                                <Text style={styles.linkGo}>바로가기 →</Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      </>
                    )}
                  </ScrollView>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      <View style={styles.bottomArea}>
        <Button label="AI 분석 리포트 보기" onPress={() => router.push('/review/ai-report')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.box,
    paddingVertical: 24,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginVertical: 24,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.iconBox,
  },

  dotActive: {
    width: 32,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textSecondary,
  },

  cardArea: {
    flex: 1,
    marginBottom: 100,
  },

  cardsContainer: {
    paddingHorizontal: CARD_SIDE_PEEK,
    gap: CARD_GAP,
  },

  card: {
    width: CARD_WIDTH,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.box,
    overflow: 'hidden',
  },

  cardHeader: {
    backgroundColor: COLORS.primaryLight,
    padding: 20,
    gap: 4,
  },

  cardPrincipleLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
  },

  cardPrincipleContent: {
    fontSize: 20,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: 24,
  },

  cardBody: {
    flex: 1,
  },

  cardBodyContent: {
    padding: 20,
  },

  section: {
    gap: 10,
  },

  sectionTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  scoreCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scoreNumber: {
    fontSize: 13,
    color: COLORS.box,
    fontFamily: 'Pretendard-SemiBold',
  },

  scoreUnit: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },

  reviewText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 22,
  },

  linkCard: {
    flexDirection: 'row',
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

  photoBox: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
  },

  bottomArea: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },

});
