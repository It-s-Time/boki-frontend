import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Image,
  Modal,
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
import BackwardIcon from 'assets/icons/backward.svg';

type GradeFilter = '전체' | 'S' | 'A' | 'B' | 'C' | 'F';
type TradeGrade = Exclude<GradeFilter, '전체'>;
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
const SCORE_HORIZONTAL = require('../../../assets/icons/Frame 550.png');
const SCORE_VERTICAL = require('../../../assets/icons/Frame 549.png');
const MEMO_ICON = require('../../../assets/icons/_레이어_1.png');
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
  const [memoVisible, setMemoVisible] = useState(false);

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
      <JournalDetail
        entry={selectedEntry}
        memoVisible={memoVisible}
        onBack={() => setSelectedEntry(null)}
        onOpenMemo={() => setMemoVisible(true)}
        onCloseMemo={() => setMemoVisible(false)}
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

function JournalDetail({
  entry,
  memoVisible,
  onBack,
  onOpenMemo,
  onCloseMemo,
}: {
  entry: JournalEntry;
  memoVisible: boolean;
  onBack: () => void;
  onOpenMemo: () => void;
  onCloseMemo: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.detailHeader}>
        <Pressable style={styles.headerCircle} onPress={onBack}>
          <BackwardIcon width={9} height={15} />
        </Pressable>
        <Text style={styles.headerTitle}>일지</Text>
        <Pressable style={styles.headerCircle} onPress={onOpenMemo}>
          <Image source={MEMO_ICON} style={styles.memoHeaderIcon} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.detailContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.detailCard}>
          <TicketDetailNotch side="left" />
          <TicketDetailNotch side="right" />
          <ScoreBurst />
          <Text style={styles.rankText}>
            Rank <Text style={styles.rankGrade}>{entry.grade}</Text>
          </Text>

          <View style={styles.tagWrap}>
            {['# 원칙준수율 A급', '# 이성적인', '# 꼼꼼한', '# 엄격한', '# 우직한'].map(
              (tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ),
            )}
          </View>

          <View style={styles.dashedLine} />

          <ReviewSection
            title="잘한 점"
            items={[
              '정해둔 손실 한도를 지켜서 큰 손해를 막았어요',
              '구매 시점을 아주 잘 잡았어요',
            ]}
          />
          <ReviewSection
            title="아쉬운 점"
            items={[
              '돈을 나누어 투자하지 않아 위험 부담이 커요',
              '너무 자주 사고팔아서 수수료가 많이 나왔어요',
            ]}
          />
        </View>
      </ScrollView>

      <MemoModal visible={memoVisible} onClose={onCloseMemo} />
    </SafeAreaView>
  );
}

function TicketDetailNotch({ side }: { side: 'left' | 'right' }) {
  const size = 28;
  const path =
    side === 'left'
      ? `M 0 0 A ${size / 2} ${size / 2} 0 0 1 0 ${size}`
      : `M ${size / 2} 0 A ${size / 2} ${size / 2} 0 0 0 ${
          size / 2
        } ${size}`;

  return (
    <View
      style={
        side === 'left' ? styles.notchLeftDetail : styles.notchRightDetail
      }
    >
      <Svg width={size / 2} height={size} viewBox={`0 0 ${size / 2} ${size}`}>
        <Path d={path} stroke="#E9E9EC" strokeWidth={1} fill="none" />
      </Svg>
      <View
        style={
          side === 'left'
            ? styles.notchLineMaskLeftDetail
            : styles.notchLineMaskRightDetail
        }
      />
    </View>
  );
}

function ScoreBurst() {
  return (
    <View style={styles.scoreBox}>
      <View style={styles.scoreArtwork}>
        <Image
          source={SCORE_HORIZONTAL}
          style={styles.scoreHorizontalImage}
          resizeMode="contain"
        />
        <Image
          source={SCORE_VERTICAL}
          style={styles.scoreVerticalImage}
          resizeMode="contain"
        />
        <Image
          source={SCORE_HORIZONTAL}
          style={styles.scoreDiagonalDownImage}
          resizeMode="contain"
        />
        <Image
          source={SCORE_HORIZONTAL}
          style={styles.scoreDiagonalUpImage}
          resizeMode="contain"
        />
        <View style={styles.scoreTextRow}>
          <Text style={styles.scorePercent}>75</Text>
          <Text style={styles.scoreUnit}>%</Text>
        </View>
      </View>
    </View>
  );
}

function ReviewSection({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={styles.reviewSection}>
      <Text style={styles.reviewTitle}>{title}</Text>
      {items.map((item, index) => (
        <View key={item} style={styles.reviewRow}>
          <View style={styles.reviewNumber}>
            <Text style={styles.reviewNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.reviewText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function MemoModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.memoCard}>
          <Pressable style={styles.memoClose} onPress={onClose}>
            <Feather name="x" size={30} color="#14151F" />
          </Pressable>
          <Text style={styles.memoTitle}>메모</Text>
          <Text style={styles.memoText}>
            당시 비트코인 시세가 갑작스럽게 오르자 판단이 다소 아쉬웠던 것
            같다.{'\n\n'}
            시드도 한번에 다 넣으면 안됐는데..{'\n'}
            판단 미스다 😭
          </Text>
          <View style={styles.memoImageRow}>
            <Image
              source={MEMO_CHART_IMAGE}
              style={styles.memoImage}
              resizeMode="cover"
            />
            <Image
              source={MEMO_COIN_IMAGE}
              style={styles.memoImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    </Modal>
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
  detailHeader: {
    height: 116,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  headerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E9E9EC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  memoHeaderIcon: {
    width: 16,
    height: 22,
  },
  detailContent: {
    paddingHorizontal: 30,
    paddingBottom: 120,
  },
  detailCard: {
    borderWidth: 1,
    borderColor: '#E9E9EC',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingBottom: 26,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  notchLeftDetail: {
    position: 'absolute',
    left: -1,
    top: 408,
    width: 14,
    height: 28,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  notchRightDetail: {
    position: 'absolute',
    right: -1,
    top: 408,
    width: 14,
    height: 28,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  notchLineMaskLeftDetail: {
    position: 'absolute',
    left: -1,
    width: 5,
    height: 30,
    backgroundColor: '#FFFFFF',
    zIndex: 3,
    elevation: 0,
    shadowOpacity: 0,
  },
  notchLineMaskRightDetail: {
    position: 'absolute',
    right: -1,
    width: 5,
    height: 30,
    backgroundColor: '#FFFFFF',
    zIndex: 3,
    elevation: 0,
    shadowOpacity: 0,
  },
  scoreBox: {
    height: 246,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreArtwork: {
    width: 214,
    height: 234,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -5,
  },
  scoreHorizontalImage: {
    position: 'absolute',
    width: 198,
    height: 22,
  },
  scoreVerticalImage: {
    position: 'absolute',
    width: 22,
    height: 198,
  },
  scoreDiagonalDownImage: {
    position: 'absolute',
    width: 180,
    height: 20,
    transform: [{ rotate: '45deg' }],
  },
  scoreDiagonalUpImage: {
    position: 'absolute',
    width: 180,
    height: 20,
    transform: [{ rotate: '-45deg' }],
  },
  scoreTextRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 5,
  },
  scorePercent: {
    width: 45,
    height: 45,
    color: '#14151F',
    fontSize: 35,
    letterSpacing: -0.6,
    lineHeight: 45,
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
  },
  scoreUnit: {
    color: '#5E5E61',
    fontSize: 17,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 8,
    marginLeft: 5,
  },
  rankText: {
    color: '#14151F',
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
    marginBottom: 22,
  },
  rankGrade: {
    color: COLORS_NEW.point,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 34,
  },
  tag: {
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F2F2F5',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: '#5E5E61',
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
  },
  dashedLine: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D1D6',
    marginBottom: 22,
  },
  reviewSection: {
    marginBottom: 20,
  },
  reviewTitle: {
    color: '#14151F',
    fontSize: 21,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 14,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 11,
  },
  reviewNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#636366',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  reviewNumberText: {
    color: '#F2F2F5',
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
  },
  reviewText: {
    flex: 1,
    color: '#5E5E61',
    fontSize: 17,
    letterSpacing: -0.6,
    lineHeight: 25,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'left',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  memoCard: {
    minHeight: 640,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 26,
  },
  memoClose: {
    position: 'absolute',
    left: 28,
    top: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E9E9EC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 2,
    elevation: 2,
  },
  memoTitle: {
    color: '#14151F',
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 46,
  },
  memoText: {
    color: '#14151F',
    fontSize: 20,
    lineHeight: 34,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 128,
  },
  memoImageRow: {
    flexDirection: 'row',
    gap: 18,
  },
  memoImage: {
    flex: 1,
    height: 164,
    borderRadius: 16,
  },
});
