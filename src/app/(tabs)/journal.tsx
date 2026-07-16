import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS_NEW } from '@/shared/constants/colors';
import { AiReport, Review, TradeGrade } from '@/features/review/types';
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
const CARD_HEIGHT = 112;
const CARD_RADIUS = 18;
const NOTCH_RADIUS = 10;
const MEMO_CHART_IMAGE = require('../../../assets/icons/Rectangle 1430106783.png');
const MEMO_COIN_IMAGE = require('../../../assets/icons/Rectangle 1430106784.png');

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
    hashtags: ['원칙준수율 A급', '이성적인', '꼼꼼한', '우아한', '우직한'],
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

function buildMockReview(): Review {
  const imageUrls = [MEMO_CHART_IMAGE, MEMO_COIN_IMAGE].map(
    (image) => Image.resolveAssetSource(image).uri,
  );

  return {
    reviewId: 0,
    tradeId: 0,
    memberId: 0,
    ruleSetId: 0,
    content:
      '당시 비트코인 시세가 갑작스럽게 오르자 판단이 다소 아쉬웠던 것 같다.\n\n시드도 한번에 다 넣으면 안됐는데..\n판단 미스다 😭',
    scores: [],
    imageUrls,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
        review={selectedEntry.coin === '비트코인' ? buildMockReview() : undefined}
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
  const [cardWidth, setCardWidth] = useState(0);

  return (
    <Pressable
      style={styles.card}
      onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}
      onPress={onPress}
    >
      {cardWidth > 0 && <TicketCardBackground width={cardWidth} />}
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
    } ${notchCenterY + notchRadius} ${width} ${
      notchCenterY + notchRadius
    }`,
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
      width={width}
      height={height}
      style={styles.cardBackground}
    >
      <Path d={path} fill="#FFFFFF" stroke="#EFEFEF" strokeWidth={1} />
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
    height: CARD_HEIGHT,
    width: '100%',
    backgroundColor: 'transparent',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
    letterSpacing: -0.6,
    lineHeight: 24,
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
  },
  gradeTextDark: {
    color: '#14151F',
  },
  tradeBadge: {
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F2F2F5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  tradeText: {
    color: '#5E5E61',
    fontSize: 17,
    letterSpacing: -0.6,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  coinText: {
    flex: 1,
    color: '#14151F',
    fontSize: 23,
    fontFamily: 'Pretendard-SemiBold',
  },
  priceText: {
    color: '#14151F',
    fontSize: 17,
    letterSpacing: -0.6,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'right',
    marginLeft: 12,
  },
});
