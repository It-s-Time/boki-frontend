import { COLORS } from '@/shared/constants/colors';
import PrincipleSetCard from '@/features/review/components/PrincipleSetCard';
import { PrincipleSet } from '@/features/review/types';
import ScreenHeader from '@/shared/components/ScreenHeader';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function SelectPrincipleSetScreen() {
  const router = useRouter();
  const { tradeId, coinName, symbol, amount, tradeType, time, price } =
    useLocalSearchParams<{
      tradeId: string;
      coinName: string;
      symbol: string;
      amount: string;
      tradeType: string;
      time: string;
      price: string;
    }>();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleStart = () => {
    if (!selectedId) return;
    router.push({
      pathname: '/review/session',
      params: {
        tradeId,
        principleSetId: selectedId,
        coinName,
        symbol,
        amount,
        tradeType,
        time,
        price,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title="복기할 매매원칙 세트 선택" />

      <Text style={styles.subtitle}>어떤 원칙으로 복기할 지 선택해보세요.</Text>

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {MOCK_PRINCIPLE_SETS.map((set) => (
          <PrincipleSetCard
            key={set.id}
            set={set}
            selected={selectedId === set.id}
            onPress={() => setSelectedId(set.id)}
          />
        ))}
      </ScrollView>

      <Pressable
        style={[styles.startButton, selectedId && styles.startButtonActive]}
        onPress={handleStart}
        disabled={!selectedId}
      >
        <Text style={[styles.startButtonText]}>복기 시작하기</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    marginTop: 4,
    marginBottom: 24,
    marginLeft: 44,
  },

  list: {
    flex: 1,
  },

  startButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.iconBox,
    marginTop: 8,
  },

  startButtonActive: {
    backgroundColor: COLORS.primary,
  },

  startButtonText: {
    fontSize: 20,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },
});
