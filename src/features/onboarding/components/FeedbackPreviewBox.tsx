import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS_NEW } from '@/shared/constants/colors';
import { AiReport } from '@/features/review/types';
import ReportSummaryCard from '@/features/review/components/ReportSummaryCard';

// The gray box reuses whatever height step 1 measured for groupWrap (passed
// in as `height`), so the card slots are derived from that height at render
// time rather than a fixed constant.
const FEEDBACK_BOX_FALLBACK_HEIGHT = 300;
const FEEDBACK_BOX_HORIZONTAL_PADDING = 44;
// The report card gets its own (smaller) margins, independent of the
// journal cards' — it needs the extra room to grow into, and its fit-scale
// is always derived from these bounds, so it can never spill past the box.
const REPORT_BOX_HORIZONTAL_PADDING = 16;
const REPORT_BOX_VERTICAL_PADDING = 8;
const FEEDBACK_CARD_HEIGHT = 88;
const FEEDBACK_CARD_RADIUS = 16;
const FEEDBACK_NOTCH_RADIUS = 8;
const FEEDBACK_BOTTOM_MARGIN = 64;
const FEEDBACK_STACK_GAP = 20;
const FEEDBACK_ENTRY_Y = 40;
const FEEDBACK_ENTRY_HOLD = 350;
const FEEDBACK_ANTICIPATION_OFFSET = 26;

// The card's position is reset to FEEDBACK_ENTRY_Y instantly (not animated),
// but its opacity fades in there for a soft "스윽" appearance. After a beat
// it plays like a tossed ball: decelerating on the way up (Easing.out), a
// brief hang at the peak, then accelerating down under "gravity"
// (Easing.in) into its slot.
function buildFeedbackDrop(
  position: Animated.Value,
  opacity: Animated.Value,
  targetY: number,
) {
  return [
    Animated.timing(opacity, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.delay(FEEDBACK_ENTRY_HOLD),
    Animated.timing(position, {
      toValue: FEEDBACK_ENTRY_Y - FEEDBACK_ANTICIPATION_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }),
    Animated.delay(100),
    Animated.timing(position, {
      toValue: targetY,
      duration: 480,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }),
  ];
}

// card1 falls and settles above FEEDBACK_BOTTOM_MARGIN worth of breathing
// room at the bottom of the box (not flush with the edge), then card2 drops
// and stacks directly on top of it with a small FEEDBACK_STACK_GAP.
function getFeedbackSlots(boxHeight: number) {
  const bottomSlotY = boxHeight - FEEDBACK_CARD_HEIGHT - FEEDBACK_BOTTOM_MARGIN;
  const stackedSlotY = bottomSlotY - FEEDBACK_CARD_HEIGHT - FEEDBACK_STACK_GAP;
  const centerSlotY = (boxHeight - FEEDBACK_CARD_HEIGHT) / 2;
  return { bottomSlotY, stackedSlotY, centerSlotY };
}

type FeedbackGrade = 'S' | 'A';

interface FeedbackTradeCard {
  grade: FeedbackGrade;
  type: '매수' | '매도';
  coin: string;
  amount: string;
  price: string;
}

const FEEDBACK_CARD_1: FeedbackTradeCard = {
  grade: 'A',
  type: '매도',
  coin: '리플',
  amount: '4XRP',
  price: '103,403원',
};

const FEEDBACK_CARD_2: FeedbackTradeCard = {
  grade: 'S',
  type: '매수',
  coin: '비트코인',
  amount: '1BTC',
  price: '103,403,000원',
};

// Same shape ReportDetail.tsx renders for real, so ReportSummaryCard below
// is driven by actual AiReport data rather than a lookalike.
const MOCK_REPORT: AiReport = {
  aiReportId: 0,
  tradeId: 0,
  status: 'COMPLETED',
  grade: 'A',
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
  recommendedRule: null,
};

// The width ReportSummaryCard is measured at before being scaled down. This
// no longer drives font size (scale is height-only, see ScaledReportPreview)
// — it only controls how much white space sits around the fixed-size
// content, so it's fine to run wider than a real phone's card would be.
const REPORT_NATURAL_WIDTH = 400;
// Extra shrink applied on top of the height-fit scale below, to nudge the
// whole card slightly smaller without disturbing its proportions.
const REPORT_SCALE_FACTOR = 0.9;
// Passed as ReportSummaryCard's bottomPadding prop for this preview only —
// ReportDetail.tsx's real screen doesn't pass it, so it keeps its default.
const REPORT_BOTTOM_PADDING = 14;

interface Props {
  active: boolean;
  height: number | null;
}

// The card-drop -> stack -> fade -> click -> report choreography can't be
// expressed as a single Animated.loop, since each stage leaves the values
// in a different place than it found them. Instead each cycle runs once,
// then synchronously snaps every value back to its resting start state
// before kicking off the next cycle, so playback never jumps.
export default function FeedbackPreviewBox({ active, height }: Props) {
  const [boxWidth, setBoxWidth] = useState(0);
  const card1Y = useRef(new Animated.Value(FEEDBACK_ENTRY_Y)).current;
  const card2Y = useRef(new Animated.Value(FEEDBACK_ENTRY_Y)).current;
  const card1Opacity = useRef(new Animated.Value(0)).current;
  const card2Opacity = useRef(new Animated.Value(0)).current;
  const card1Scale = useRef(new Animated.Value(1)).current;
  const reportOpacity = useRef(new Animated.Value(0)).current;

  const boxHeight = height ?? FEEDBACK_BOX_FALLBACK_HEIGHT;
  const { bottomSlotY, stackedSlotY, centerSlotY } =
    getFeedbackSlots(boxHeight);

  useEffect(() => {
    if (!active) {
      card1Y.setValue(FEEDBACK_ENTRY_Y);
      card2Y.setValue(FEEDBACK_ENTRY_Y);
      card1Opacity.setValue(0);
      card2Opacity.setValue(0);
      card1Scale.setValue(1);
      reportOpacity.setValue(0);
      return;
    }

    let cancelled = false;

    const runCycle = () => {
      if (cancelled) return;

      Animated.sequence([
        // 1. card1 fades in, hops up a touch, then glides down to its slot.
        // card2 stays invisible (opacity 0) until card1 has fully landed.
        ...buildFeedbackDrop(card1Y, card1Opacity, bottomSlotY),
        Animated.delay(300),
        // 2. card2 fades in and stacks directly on card1 the same way.
        ...buildFeedbackDrop(card2Y, card2Opacity, stackedSlotY),
        Animated.delay(700),
        // 3. card2 fades out while card1 rises to the center.
        Animated.parallel([
          Animated.timing(card2Opacity, {
            toValue: 0,
            duration: 350,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(card1Y, {
            toValue: centerSlotY,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(300),
        // 4. a quick press-down bounce simulates the card being tapped.
        Animated.timing(card1Scale, {
          toValue: 0.92,
          duration: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(card1Scale, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
        // 5. card1 fades out while the AI report card fades in.
        Animated.parallel([
          Animated.timing(card1Opacity, {
            toValue: 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(80),
            Animated.timing(reportOpacity, {
              toValue: 1,
              duration: 350,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.delay(1300),
        Animated.timing(reportOpacity, {
          toValue: 0,
          duration: 250,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(150),
      ]).start(({ finished }) => {
        if (!finished || cancelled) return;

        card1Y.setValue(FEEDBACK_ENTRY_Y);
        card2Y.setValue(FEEDBACK_ENTRY_Y);
        card1Opacity.setValue(0);
        card2Opacity.setValue(0);
        card1Scale.setValue(1);
        reportOpacity.setValue(0);

        runCycle();
      });
    };

    runCycle();

    return () => {
      cancelled = true;
      card1Y.stopAnimation();
      card2Y.stopAnimation();
      card1Opacity.stopAnimation();
      card2Opacity.stopAnimation();
      card1Scale.stopAnimation();
      reportOpacity.stopAnimation();
    };
  }, [
    active,
    card1Y,
    card2Y,
    card1Opacity,
    card2Opacity,
    card1Scale,
    reportOpacity,
    bottomSlotY,
    stackedSlotY,
    centerSlotY,
  ]);

  return (
    <View
      style={[styles.feedbackBox, { height: boxHeight }]}
      onLayout={(event) => setBoxWidth(event.nativeEvent.layout.width)}
    >
      <MiniJournalCard
        card={FEEDBACK_CARD_2}
        translateY={card2Y}
        opacity={card2Opacity}
      />
      <MiniJournalCard
        card={FEEDBACK_CARD_1}
        translateY={card1Y}
        opacity={card1Opacity}
        scale={card1Scale}
      />
      <ScaledReportPreview
        opacity={reportOpacity}
        boxWidth={boxWidth}
        boxHeight={boxHeight}
      />
    </View>
  );
}

function FeedbackGradeBadge({ grade }: { grade: FeedbackGrade }) {
  if (grade === 'S') {
    return (
      <LinearGradient
        colors={['#FFEC8E', '#FFD23F']}
        locations={[0, 1]}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0, y: 0.5 }}
        style={styles.feedbackGradeBadge}
      >
        <Text style={[styles.feedbackGradeText, styles.feedbackGradeTextDark]}>
          {grade}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.feedbackGradeBadge, { backgroundColor: '#636366' }]}>
      <Text style={[styles.feedbackGradeText, { color: '#FFFFFF' }]}>
        {grade}
      </Text>
    </View>
  );
}

function FeedbackTicketBackground({ width }: { width: number }) {
  const height = FEEDBACK_CARD_HEIGHT;
  const radius = FEEDBACK_CARD_RADIUS;
  const notchRadius = FEEDBACK_NOTCH_RADIUS;
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
      width={width}
      height={height}
      style={styles.feedbackCardBackground}
    >
      <Path d={path} fill="#FFFFFF" stroke="#EFEFEF" strokeWidth={1} />
    </Svg>
  );
}

interface MiniJournalCardProps {
  card: FeedbackTradeCard;
  translateY: Animated.Value;
  opacity: Animated.Value;
  scale?: Animated.Value;
}

function MiniJournalCard({
  card,
  translateY,
  opacity,
  scale,
}: MiniJournalCardProps) {
  const [cardWidth, setCardWidth] = useState(0);

  return (
    <Animated.View
      onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}
      style={[
        styles.feedbackCard,
        {
          opacity,
          transform: [{ translateY }, { scale: scale ?? 1 }],
        },
      ]}
    >
      {cardWidth > 0 && <FeedbackTicketBackground width={cardWidth} />}
      <View style={styles.feedbackCardTopRow}>
        <FeedbackGradeBadge grade={card.grade} />
        <View style={styles.feedbackTradeBadge}>
          <Text style={styles.feedbackTradeText}>{card.type}</Text>
        </View>
      </View>
      <View style={styles.feedbackCardBottomRow}>
        <Text style={styles.feedbackCoinText}>
          {card.coin} · {card.amount}
        </Text>
        <Text style={styles.feedbackPriceText}>{card.price}</Text>
      </View>
    </Animated.View>
  );
}

interface ScaledReportPreviewProps {
  opacity: Animated.Value;
  boxWidth: number;
  boxHeight: number;
}

// Renders the *real* ReportSummaryCard (same component ReportDetail.tsx
// uses) at its natural size off-screen to measure how tall it comes out,
// then draws a second, visible copy shrunk to fit the box with a plain
// transform: scale. Reusing the component instead of hand-recreating a
// "mini" version at guessed sizes is what keeps this preview's proportions
// identical to the real screen.
function ScaledReportPreview({
  opacity,
  boxWidth,
  boxHeight,
}: ScaledReportPreviewProps) {
  const [naturalHeight, setNaturalHeight] = useState(0);

  const availableWidth = Math.max(
    boxWidth - REPORT_BOX_HORIZONTAL_PADDING * 2,
    0,
  );
  const availableHeight = Math.max(
    boxHeight - REPORT_BOX_VERTICAL_PADDING * 2,
    0,
  );
  // Scale is driven by height alone, so font sizes and every other element
  // stay put — widening REPORT_NATURAL_WIDTH only adds white space around
  // them, it never re-shrinks text to fit. The rendered width is separately
  // clamped to availableWidth below (cropping only on a device too narrow
  // to fit it, rather than shrinking the whole card).
  const scale =
    naturalHeight > 0 && availableHeight > 0
      ? (availableHeight / naturalHeight) * REPORT_SCALE_FACTOR
      : 0;
  const renderedWidth = Math.min(REPORT_NATURAL_WIDTH * scale, availableWidth);

  return (
    <Animated.View style={[styles.reportCardWrap, { opacity }]}>
      <View
        style={styles.reportMeasureWrap}
        pointerEvents="none"
        onLayout={(event) => setNaturalHeight(event.nativeEvent.layout.height)}
      >
        <ReportSummaryCard
          report={MOCK_REPORT}
          bottomPadding={REPORT_BOTTOM_PADDING}
        />
      </View>

      {scale > 0 && (
        <View
          style={{
            width: renderedWidth,
            height: naturalHeight * scale,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: REPORT_NATURAL_WIDTH,
              height: naturalHeight,
              transform: [{ scale }],
            }}
          >
            <ReportSummaryCard
              report={MOCK_REPORT}
              bottomPadding={REPORT_BOTTOM_PADDING}
            />
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  feedbackBox: {
    backgroundColor: COLORS_NEW.lightGray,
    borderRadius: 20,
    overflow: 'hidden',
  },
  feedbackCard: {
    position: 'absolute',
    left: FEEDBACK_BOX_HORIZONTAL_PADDING,
    right: FEEDBACK_BOX_HORIZONTAL_PADDING,
    height: FEEDBACK_CARD_HEIGHT,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  feedbackCardBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  feedbackCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  feedbackGradeBadge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  feedbackGradeText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
  },
  feedbackGradeTextDark: {
    color: '#14151F',
  },
  feedbackTradeBadge: {
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F2F2F5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  feedbackTradeText: {
    color: '#5E5E61',
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
  },
  feedbackCardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedbackCoinText: {
    flex: 1,
    color: '#14151F',
    fontSize: 17,
    fontFamily: 'Pretendard-SemiBold',
  },
  feedbackPriceText: {
    color: '#14151F',
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'right',
    marginLeft: 10,
  },
  reportCardWrap: {
    position: 'absolute',
    left: REPORT_BOX_HORIZONTAL_PADDING,
    right: REPORT_BOX_HORIZONTAL_PADDING,
    top: REPORT_BOX_VERTICAL_PADDING,
    bottom: REPORT_BOX_VERTICAL_PADDING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Rendered off-screen at a fixed width purely so its natural (unscaled)
  // height can be measured via onLayout.
  reportMeasureWrap: {
    position: 'absolute',
    left: -9999,
    top: 0,
    width: REPORT_NATURAL_WIDTH,
    opacity: 0,
  },
});
