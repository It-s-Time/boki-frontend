import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, FeDropShadow, Filter, Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS_NEW } from '@/shared/constants/colors';
import BackHeader from '@/shared/components/BackHeader';
import { TradeGrade } from '@/features/review/types';
import { useTradeList } from '@/features/trade/hooks/useTrades';
import { COIN_NAMES, getCoinSymbol } from '@/features/trade/constants';
import type { Trade } from '@/features/trade/types';

type GradeFilter = '전체' | TradeGrade;
type GradedTrade = Trade & { grade: TradeGrade };

const FILTERS: GradeFilter[] = ['전체', 'S', 'A', 'B', 'C', 'F'];
const CARD_HEIGHT = 112;
const CARD_RADIUS = 18;
const NOTCH_RADIUS = 10;
// The SVG canvas needs extra room around the card shape so the drop-shadow
// filter (which extends past the path's own bounds) doesn't get clipped at
// the card's edges.
const SHADOW_MARGIN = 24;

function formatDate(tradedAt: string) {
  const date = new Date(tradedAt);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}년 ${month}월 ${day}일`;
}

const GRADE_COLORS: Record<TradeGrade, { bg: string; text: string }> = {
  S: { bg: '#FFD23F', text: COLORS_NEW.textPrimary },
  A: { bg: COLORS_NEW.border, text: COLORS_NEW.background },
  B: { bg: COLORS_NEW.border, text: COLORS_NEW.background },
  C: { bg: COLORS_NEW.border, text: COLORS_NEW.background },
  F: { bg: COLORS_NEW.border, text: COLORS_NEW.background },
};

export default function JournalScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<GradeFilter>('전체');

  const {
    data: trades,
    isLoading,
    isError,
    refetch,
  } = useTradeList({ reviewStatus: 'COMPLETED' });

  const gradedTrades = useMemo<GradedTrade[]>(
    () => (trades ?? []).filter((trade): trade is GradedTrade => trade.grade !== null),
    [trades],
  );

  const filteredEntries = useMemo(() => {
    if (selectedFilter === '전체') return gradedTrades;
    return gradedTrades.filter((trade) => trade.grade === selectedFilter);
  }, [gradedTrades, selectedFilter]);

  const groupedEntries = useMemo(() => {
    return filteredEntries.reduce<Record<string, GradedTrade[]>>(
      (groups, trade) => {
        const date = formatDate(trade.tradedAt);
        groups[date] = [...(groups[date] ?? []), trade];
        return groups;
      },
      {},
    );
  }, [filteredEntries]);

  const openReport = (tradeId: number) => {
    router.push({ pathname: '/review/ai-report', params: { tradeId } });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <BackHeader title="일지" hideBackButton />
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((filter) => {
          const active = selectedFilter === filter;

          return (
            <Pressable
              key={filter}
              style={[
                styles.filterChip,
                filter === '전체' && styles.allFilterChip,
                active && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[styles.filterText, active && styles.filterTextActive]}
              >
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Text style={styles.stateText}>불러오는 중이에요</Text>
        ) : isError ? (
          <Pressable onPress={() => refetch()}>
            <Text style={styles.stateText}>
              불러오지 못했어요, 다시 시도해주세요
            </Text>
          </Pressable>
        ) : Object.keys(groupedEntries).length === 0 ? (
          <Text style={styles.stateText}>
            {selectedFilter === '전체'
              ? '아직 복기를 완료한 거래가 없어요'
              : '해당 등급의 거래가 없어요'}
          </Text>
        ) : (
          Object.entries(groupedEntries).map(([date, trades]) => (
            <View key={date} style={styles.dateSection}>
              <Text style={styles.dateTitle}>{date}</Text>
              {trades.map((trade) => (
                <JournalCard
                  key={trade.tradeId}
                  trade={trade}
                  onPress={() => openReport(trade.tradeId)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function JournalCard({
  trade,
  onPress,
}: {
  trade: GradedTrade;
  onPress: () => void;
}) {
  const [cardWidth, setCardWidth] = useState(0);
  const coinSymbol = getCoinSymbol(trade.coinType);
  const coinName = COIN_NAMES[coinSymbol] ?? coinSymbol;
  const typeText = trade.tradeType === 'BUY' ? '매수' : '매도';

  return (
    <Pressable
      style={styles.card}
      onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}
      onPress={onPress}
    >
      {cardWidth > 0 && <TicketCardBackground width={cardWidth} />}
      <View style={styles.cardTopRow}>
        <GradeBadge grade={trade.grade} />
        <View style={styles.tradeBadge}>
          <Text style={styles.tradeText}>{typeText}</Text>
        </View>
      </View>
      <View style={styles.cardBottomRow}>
        <Text style={styles.coinText}>
          {coinName} · {trade.quantity}
          {coinSymbol}
        </Text>
        <Text style={styles.priceText}>{trade.price.toLocaleString()}원</Text>
      </View>
    </Pressable>
  );
}

function TicketCardBackground({ width }: { width: number }) {
  const height = CARD_HEIGHT;
  const radius = CARD_RADIUS;
  const notchRadius = NOTCH_RADIUS;
  const notchCenterY = height / 2;
  const notchControl = notchRadius * 0.5522847498;
  const path = [
    `M ${radius} 0`,
    `H ${width - radius}`,
    `Q ${width} 0 ${width} ${radius}`,
    `V ${notchCenterY - notchRadius}`,
    `C ${width - notchControl} ${notchCenterY - notchRadius} ${
      width - notchRadius
    } ${notchCenterY - notchControl} ${width - notchRadius} ${notchCenterY}`,
    `C ${width - notchRadius} ${notchCenterY + notchControl} ${
      width - notchControl
    } ${notchCenterY + notchRadius} ${width} ${notchCenterY + notchRadius}`,
    `V ${height - radius}`,
    `Q ${width} ${height} ${width - radius} ${height}`,
    `H ${radius}`,
    `Q 0 ${height} 0 ${height - radius}`,
    `V ${notchCenterY + notchRadius}`,
    `C ${notchControl} ${notchCenterY + notchRadius} ${notchRadius} ${
      notchCenterY + notchControl
    } ${notchRadius} ${notchCenterY}`,
    `C ${notchRadius} ${notchCenterY - notchControl} ${notchControl} ${
      notchCenterY - notchRadius
    } 0 ${notchCenterY - notchRadius}`,
    `V ${radius}`,
    `Q 0 0 ${radius} 0`,
    'Z',
  ].join(' ');

  return (
    <Svg
      pointerEvents="none"
      width={width + SHADOW_MARGIN * 2}
      height={height + SHADOW_MARGIN * 2}
      style={[
        styles.cardBackground,
        { left: -SHADOW_MARGIN, top: -SHADOW_MARGIN },
      ]}
    >
      <Defs>
        <Filter id="cardShadow" x="-50%" y="-50%" width="200%" height="200%">
          <FeDropShadow
            dx={0}
            dy={0}
            stdDeviation={7}
            floodColor="#000000"
            floodOpacity={0.055}
          />
        </Filter>
      </Defs>
      <Path
        d={path}
        fill={COLORS_NEW.background}
        stroke={COLORS_NEW.lightBorder}
        strokeWidth={1}
        filter="url(#cardShadow)"
        transform={`translate(${SHADOW_MARGIN}, ${SHADOW_MARGIN})`}
      />
    </Svg>
  );
}

function GradeBadge({ grade }: { grade: TradeGrade }) {
  if (grade === 'S') {
    return (
      <LinearGradient
        colors={['#FFEC8E', '#FFD23F']}
        locations={[0, 1]}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0, y: 0.5 }}
        style={styles.gradeBadge}
      >
        <Text style={[styles.gradeText, styles.gradeTextDark]}>{grade}</Text>
      </LinearGradient>
    );
  }

  const gradeColor = GRADE_COLORS[grade];

  return (
    <View style={[styles.gradeBadge, { backgroundColor: gradeColor.bg }]}>
      <Text style={[styles.gradeText, { color: gradeColor.text }]}>
        {grade}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  filterChip: {
    minWidth: 54,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS_NEW.lightGray,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  allFilterChip: {
    minWidth: 66,
  },
  filterChipActive: {
    backgroundColor: COLORS_NEW.fab,
  },
  filterText: {
    color: COLORS_NEW.textSecondary,
    fontSize: 16,
    letterSpacing: -0.64,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
  },
  filterTextActive: {
    color: COLORS_NEW.lightGray,
  },
  scroll: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 30,
    paddingBottom: 120,
  },
  stateText: {
    color: COLORS_NEW.textSecondary,
    fontSize: 16,
    letterSpacing: -0.64,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
    marginTop: 40,
  },
  dateSection: {
    marginBottom: 22,
  },
  dateTitle: {
    color: COLORS_NEW.textPrimary,
    fontSize: 20,
    letterSpacing: -0.8,
    lineHeight: 30,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'left',
    marginBottom: 18,
  },
  card: {
    height: CARD_HEIGHT,
    width: '100%',
    backgroundColor: 'transparent',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 16,
  },
  cardBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    zIndex: 1,
  },
  gradeBadge: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  gradeText: {
    fontSize: 17,
    letterSpacing: -0.68,
    lineHeight: 24,
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
  },
  gradeTextDark: {
    color: COLORS_NEW.textPrimary,
  },
  tradeBadge: {
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS_NEW.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  tradeText: {
    color: COLORS_NEW.textSecondary,
    fontSize: 16,
    letterSpacing: -0.68,
    lineHeight: 24,
    fontFamily: 'Pretendard-Medium',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  coinText: {
    flex: 1,
    color: COLORS_NEW.textPrimary,
    fontSize: 20,
    letterSpacing: -0.92,
    fontFamily: 'Pretendard-Medium',
  },
  priceText: {
    color: COLORS_NEW.textPrimary,
    fontSize: 16,
    letterSpacing: -0.68,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'right',
    marginLeft: 12,
  },
});
