import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS_NEW } from '@/shared/constants/colors';
import { AiReport, TradeGrade } from '@/features/review/types';
import ReportDetail from '@/features/review/components/ReportDetail';

type GradeFilter = '전체' | TradeGrade;
type TradeType = '매수' | '매도';

type JournalEntry = {
  id: string;
  date: string;
  grade: TradeGrade;
  type: TradeType;
  coin: string;
  amount: string;
  price: string;
};

const FILTERS: GradeFilter[] = ['전체', 'S', 'A', 'B', 'C', 'F'];

const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'btc-20260730',
    date: '2026년 07월 30일',
    grade: 'S',
    type: '매수',
    coin: '비트코인',
    amount: '1BTC',
    price: '103,403,000원',
  },
  {
    id: 'xrp-20260730',
    date: '2026년 07월 30일',
    grade: 'A',
    type: '매도',
    coin: '리플',
    amount: '4XRP',
    price: '103,403원',
  },
  {
    id: 'btc-20260728',
    date: '2026년 07월 28일',
    grade: 'C',
    type: '매수',
    coin: '비트코인',
    amount: '1BTC',
    price: '103,403,000원',
  },
  {
    id: 'xrp-20260728',
    date: '2026년 07월 28일',
    grade: 'A',
    type: '매도',
    coin: '리플',
    amount: '4XRP',
    price: '103,403원',
  },
];

function buildMockAiReport(entry: JournalEntry): AiReport {
  return {
    aiReportId: 0,
    tradeId: 0,
    status: 'COMPLETED',
    grade: entry.grade,
    complianceRate: 0.75,
    hashtags: ['원칙준수율 A급', '이성적인', '꼼꼼한', '엄격한', '우직한'],
    goodPoints: [
      '정해둔 손실 한도를 지켜서 큰 손해를 막았어요',
      '구매 시점을 아주 잘 잡았어요',
    ],
    badPoints: [
      '돈을 나누어 투자하지 않아 위험 부담이 커요',
      '너무 자주 사고팔아서 수수료가 많이 나왔어요',
    ],
    recommendedRule: {
      type: '분할 매수',
      content: '한 번에 몰빵하지 않고 정해둔 금액만큼 나눠서 매수해보세요.',
    },
  };
}

const GRADE_COLORS: Record<TradeGrade, { bg: string; text: string }> = {
  S: { bg: '#FFD23F', text: '#14151F' },
  A: { bg: '#636366', text: '#FFFFFF' },
  B: { bg: '#636366', text: '#FFFFFF' },
  C: { bg: '#636366', text: '#FFFFFF' },
  F: { bg: '#636366', text: '#FFFFFF' },
};

export default function JournalScreen() {
  const [selectedFilter, setSelectedFilter] = useState<GradeFilter>('전체');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const filteredEntries = useMemo(() => {
    if (selectedFilter === '전체') return JOURNAL_ENTRIES;
    return JOURNAL_ENTRIES.filter((entry) => entry.grade === selectedFilter);
  }, [selectedFilter]);

  const groupedEntries = useMemo(() => {
    return filteredEntries.reduce<Record<string, JournalEntry[]>>(
      (groups, entry) => {
        groups[entry.date] = [...(groups[entry.date] ?? []), entry];
        return groups;
      },
      {},
    );
  }, [filteredEntries]);

  if (selectedEntry) {
    return (
      <ReportDetail
        report={buildMockAiReport(selectedEntry)}
        review={undefined}
        onBack={() => setSelectedEntry(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>일지</Text>
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
                style={[
                  styles.filterText,
                  active && styles.filterTextActive,
                ]}
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
        {Object.entries(groupedEntries).map(([date, entries]) => (
          <View key={date} style={styles.dateSection}>
            <Text style={styles.dateTitle}>{date}</Text>
            {entries.map((entry) => (
              <JournalCard
                key={entry.id}
                entry={entry}
                onPress={() => setSelectedEntry(entry)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function JournalCard({
  entry,
  onPress,
}: {
  entry: JournalEntry;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <TicketNotch side="left" />
      <TicketNotch side="right" />
      <View style={styles.cardTopRow}>
        <GradeBadge grade={entry.grade} />
        <View style={styles.tradeBadge}>
          <Text style={styles.tradeText}>{entry.type}</Text>
        </View>
      </View>
      <View style={styles.cardBottomRow}>
        <Text style={styles.coinText}>
          {entry.coin} · {entry.amount}
        </Text>
        <Text style={styles.priceText}>{entry.price}</Text>
      </View>
    </Pressable>
  );
}

function TicketNotch({
  side,
  size = 20,
}: {
  side: 'left' | 'right';
  size?: number;
}) {
  const path =
    side === 'left'
      ? `M 0 0 A ${size / 2} ${size / 2} 0 0 1 0 ${size}`
      : `M ${size / 2} 0 A ${size / 2} ${size / 2} 0 0 0 ${
          size / 2
        } ${size}`;

  return (
    <View style={side === 'left' ? styles.notchLeft : styles.notchRight}>
      <View
        style={
          side === 'left' ? styles.notchMaskLeft : styles.notchMaskRight
        }
      />
      <Svg width={size / 2} height={size} viewBox={`0 0 ${size / 2} ${size}`}>
        <Path d={path} stroke="#EFEFEF" strokeWidth={1} fill="none" />
      </Svg>
      <View
        style={
          side === 'left'
            ? styles.notchLineMaskLeft
            : styles.notchLineMaskRight
        }
      />
    </View>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 98,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 26,
  },
  headerTitle: {
    color: '#14151F',
    fontSize: 23,
    fontFamily: 'Pretendard-Regular',
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
    backgroundColor: '#F2F2F5',
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
    backgroundColor: '#272727',
  },
  filterText: {
    color: '#5E5E61',
    fontSize: 16,
    letterSpacing: -0.6,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
  },
  filterTextActive: {
    color: '#F2F2F5',
  },
  scroll: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 30,
    paddingBottom: 120,
  },
  dateSection: {
    marginBottom: 22,
  },
  dateTitle: {
    color: '#14151F',
    fontSize: 20,
    letterSpacing: -0.8,
    lineHeight: 30,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'left',
    marginBottom: 18,
  },
  card: {
    height: 103,
    width: '100%',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: 17,
    paddingBottom: 17,
    marginBottom: 16,
  },
  notchLeft: {
    position: 'absolute',
    left: 1,
    top: 42.5,
    width: 10,
    height: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 2,
  },
  notchRight: {
    position: 'absolute',
    right: 1,
    top: 42.5,
    width: 10,
    height: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 2,
  },
  notchMaskLeft: {
    position: 'absolute',
    left: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  notchMaskRight: {
    position: 'absolute',
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  notchLineMaskLeft: {
    position: 'absolute',
    left: -2,
    width: 5,
    height: 22,
    backgroundColor: '#FFFFFF',
    zIndex: 3,
    elevation: 0,
    shadowOpacity: 0,
  },
  notchLineMaskRight: {
    position: 'absolute',
    right: -2,
    width: 5,
    height: 22,
    backgroundColor: '#FFFFFF',
    zIndex: 3,
    elevation: 0,
    shadowOpacity: 0,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  gradeBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  gradeText: {
    fontSize: 16,
    letterSpacing: -0.6,
    lineHeight: 24,
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
  },
  gradeTextDark: {
    color: '#14151F',
  },
  tradeBadge: {
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F2F2F5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  tradeText: {
    color: '#5E5E61',
    fontSize: 16,
    letterSpacing: -0.6,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinText: {
    flex: 1,
    color: '#14151F',
    fontSize: 21,
    fontFamily: 'Pretendard-SemiBold',
  },
  priceText: {
    color: '#14151F',
    fontSize: 16,
    letterSpacing: -0.6,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'right',
    marginLeft: 12,
  },
});
