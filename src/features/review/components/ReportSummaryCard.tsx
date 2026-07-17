import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, FeDropShadow, Filter, Path } from 'react-native-svg';
import { COLORS_NEW } from '@/shared/constants/colors';
import { AiReport } from '../types';

// 8-ray sunburst around the score: rays fill clockwise from the top
// (12 o'clock) in proportion to `percent`, one ray per 12.5%.
const SCORE_RAY_COUNT = 8;
const SCORE_RAY_ANGLES = Array.from(
  { length: SCORE_RAY_COUNT },
  (_, index) => (360 / SCORE_RAY_COUNT) * index,
);
// Colors sampled directly from the zdesign mockup's baked-in artwork
// (assets/icons/Frame 549/550.png) so the dynamic rays match exactly.
const SCORE_RAY_FILLED = '#EE7A60';
const SCORE_RAY_UNFILLED = '#252930';
const SCORE_RAY_RADIUS = 72;
const DETAIL_CARD_RADIUS = 24;
const DETAIL_NOTCH_RADIUS = 14;
type ReportGrade = NonNullable<AiReport['grade']>;

const GRADE_PERCENT: Record<ReportGrade, number> = {
  S: 100,
  A: 80,
  B: 60,
  C: 40,
  F: 10,
};
// Extra canvas room so the drop-shadow filter isn't clipped at the card's
// own edges — same trick as journal.tsx's TicketCardBackground.
const DETAIL_SHADOW_MARGIN = 24;

interface Props {
  report: AiReport;
  // Defaults to the real screen's 20. Callers that shrink this card down
  // (e.g. FeedbackPreviewBox) can pass a smaller value so the bottom
  // whitespace is trimmed *before* layout — the rounded-corner notch below
  // is redrawn to match whatever height that produces, so cropping the
  // rendered output after the fact (which cuts the curve off flat) isn't
  // needed.
  bottomPadding?: number;
}

// The score/rank/hashtags/good-bad-points card, factored out of
// ReportDetail.tsx so it can be reused as-is (not rebuilt) anywhere a
// smaller preview of the same UI is needed — see FeedbackPreviewBox, which
// renders this at natural size and scales it down with a transform rather
// than re-implementing it at hand-picked sizes.
export default function ReportSummaryCard({ report, bottomPadding }: Props) {
  const [detailCardSize, setDetailCardSize] = useState({ width: 0, height: 0 });
  const [dividerY, setDividerY] = useState<number | null>(null);

  const grade = getReportGrade(report);
  const percent = getReportPercent(report, grade);
  const hashtags = report.hashtags ?? [];
  const tagRows =
    hashtags.length === 0
      ? []
      : hashtags.length > 3
        ? [hashtags.slice(0, hashtags.length - 3), hashtags.slice(-3)]
        : [hashtags];
  const goodPoints = report.goodPoints ?? [];
  const badPoints = report.badPoints ?? [];

  return (
    <View
      style={[
        styles.detailCard,
        bottomPadding !== undefined && { paddingBottom: bottomPadding },
      ]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setDetailCardSize({ width, height });
      }}
    >
      {detailCardSize.width > 0 &&
        detailCardSize.height > 0 &&
        dividerY !== null && (
          <TicketDetailBackground
            width={detailCardSize.width}
            height={detailCardSize.height}
            notchCenterY={dividerY}
          />
        )}
      <ScoreBurst percent={percent} />
      <Text style={styles.rankText}>
        Rank <Text style={styles.rankGrade}>{grade ?? '-'}</Text>
      </Text>

      <View style={styles.tagWrap}>
        {tagRows.map((row, rowIndex) => (
          <View key={`tag-row-${rowIndex}`} style={styles.tagRow}>
            {row.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}># {tag}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View
        style={styles.dashedLine}
        onLayout={(event) => setDividerY(event.nativeEvent.layout.y)}
      />

      <ReviewSection title="잘한 점" items={goodPoints} />
      <ReviewSection title="아쉬운 점" items={badPoints} isLast />
    </View>
  );
}

function getReportGrade(report: AiReport): ReportGrade | null {
  const directGrade = normalizeGrade(report.grade);

  if (directGrade) {
    return directGrade;
  }

  const gradeTag = report.hashtags?.find((tag) =>
    /원칙|준수|랭크|등급|급|rank/i.test(tag),
  );

  return normalizeGrade(gradeTag);
}

function getReportPercent(report: AiReport, grade: ReportGrade | null) {
  if (grade) {
    return GRADE_PERCENT[grade];
  }

  return Math.round(report.complianceRate ?? 0);
}

function normalizeGrade(value: string | null | undefined): ReportGrade | null {
  const grade = value?.trim().toUpperCase().match(/[SABCF]/)?.[0];

  if (!grade || !(grade in GRADE_PERCENT)) {
    return null;
  }

  return grade as ReportGrade;
}

function TicketDetailBackground({
  width,
  height,
  notchCenterY,
}: {
  width: number;
  height: number;
  notchCenterY: number;
}) {
  const radius = DETAIL_CARD_RADIUS;
  const notchRadius = DETAIL_NOTCH_RADIUS;
  const notchControl = notchRadius * 0.5522847498;
  const notchY = Math.min(
    Math.max(notchCenterY, radius + notchRadius),
    height - radius - notchRadius,
  );
  const path = [
    `M ${radius} 0`,
    `H ${width - radius}`,
    `Q ${width} 0 ${width} ${radius}`,
    `V ${notchY - notchRadius}`,
    `C ${width - notchControl} ${notchY - notchRadius} ${
      width - notchRadius
    } ${notchY - notchControl} ${width - notchRadius} ${notchY}`,
    `C ${width - notchRadius} ${notchY + notchControl} ${
      width - notchControl
    } ${notchY + notchRadius} ${width} ${notchY + notchRadius}`,
    `V ${height - radius}`,
    `Q ${width} ${height} ${width - radius} ${height}`,
    `H ${radius}`,
    `Q 0 ${height} 0 ${height - radius}`,
    `V ${notchY + notchRadius}`,
    `C ${notchControl} ${notchY + notchRadius} ${notchRadius} ${
      notchY + notchControl
    } ${notchRadius} ${notchY}`,
    `C ${notchRadius} ${notchY - notchControl} ${notchControl} ${
      notchY - notchRadius
    } 0 ${notchY - notchRadius}`,
    `V ${radius}`,
    `Q 0 0 ${radius} 0`,
    'Z',
  ].join(' ');

  return (
    <Svg
      pointerEvents="none"
      width={width + DETAIL_SHADOW_MARGIN * 2}
      height={height + DETAIL_SHADOW_MARGIN * 2}
      style={[
        styles.detailCardBackground,
        { left: -DETAIL_SHADOW_MARGIN, top: -DETAIL_SHADOW_MARGIN },
      ]}
    >
      <Defs>
        <Filter
          id="detailCardShadow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <FeDropShadow
            dx={0}
            dy={0}
            stdDeviation={9}
            floodColor="#000000"
            floodOpacity={0.045}
          />
        </Filter>
      </Defs>
      <Path
        d={path}
        fill={COLORS_NEW.background}
        stroke={COLORS_NEW.lightBorder}
        strokeWidth={1}
        filter="url(#detailCardShadow)"
        transform={`translate(${DETAIL_SHADOW_MARGIN}, ${DETAIL_SHADOW_MARGIN})`}
      />
    </Svg>
  );
}

function ScoreBurst({ percent }: { percent: number }) {
  const filledCount = Math.max(
    0,
    Math.min(SCORE_RAY_COUNT, Math.round((percent / 100) * SCORE_RAY_COUNT)),
  );
  return (
    <View style={styles.scoreBox}>
      <View style={styles.scoreArtwork}>
        {SCORE_RAY_ANGLES.map((angle, index) => (
          <View
            key={angle}
            style={[
              styles.scoreRay,
              {
                backgroundColor:
                  index < filledCount ? SCORE_RAY_FILLED : SCORE_RAY_UNFILLED,
                transform: [
                  { rotate: `${angle}deg` },
                  { translateY: -SCORE_RAY_RADIUS },
                ],
              },
            ]}
          />
        ))}
        <View style={styles.scoreTextRow}>
          <Text style={styles.scorePercent}>{percent}</Text>
          <Text style={styles.scoreUnit}>%</Text>
        </View>
      </View>
    </View>
  );
}

function ReviewSection({
  title,
  items,
  isLast,
}: {
  title: string;
  items: string[];
  isLast?: boolean;
}) {
  return (
    <View style={[styles.reviewSection, isLast && styles.reviewSectionLast]}>
      <Text style={styles.reviewTitle}>{title}</Text>
      {items.map((item, index) => (
        <View
          key={item}
          style={[
            styles.reviewRow,
            isLast && index === items.length - 1 && styles.reviewRowLast,
          ]}
        >
          <View style={styles.reviewNumber}>
            <Text style={styles.reviewNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.reviewText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  detailCard: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  detailCardBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
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
  scoreRay: {
    position: 'absolute',
    // Centered within scoreArtwork (214x234); rotate+translateY (applied
    // per-ray above) then sweeps each one out to its point on the ring.
    left: 97,
    top: 92,
    width: 20,
    height: 48,
    borderRadius: 4,
  },
  scoreTextRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 5,
  },
  scorePercent: {
    minWidth: 45,
    height: 45,
    color: COLORS_NEW.textPrimary,
    fontSize: 36,
    letterSpacing: -1.4,
    lineHeight: 45,
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
  },
  scoreUnit: {
    color: COLORS_NEW.textSecondary,
    fontSize: 16,
    letterSpacing: -0.68,
    fontFamily: 'Pretendard-Regular',
    marginLeft: 2,
    marginBottom: 6,
  },
  rankText: {
    color: COLORS_NEW.textPrimary,
    fontSize: 24,
    letterSpacing: -0.96,
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
    marginBottom: 22,
  },
  rankGrade: {
    color: '#EE7A60',
    fontSize: 24,
    letterSpacing: -0.96,
    fontFamily: 'Pretendard-Bold',
  },
  tagWrap: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 34,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 14,
  },
  tag: {
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 15,
    backgroundColor: COLORS_NEW.lightGray,
    paddingHorizontal: 15,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 16,
    letterSpacing: -0.64,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
    color: COLORS_NEW.textSecondary,
    textAlign: 'center',
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
  reviewSectionLast: {
    marginBottom: 0,
  },
  reviewTitle: {
    color: COLORS_NEW.textPrimary,
    fontSize: 21,
    letterSpacing: -0.84,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 14,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 11,
  },
  reviewRowLast: {
    marginBottom: 0,
  },
  reviewNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS_NEW.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  reviewNumberText: {
    color: COLORS_NEW.background,
    fontSize: 14,
    letterSpacing: -0.56,
    lineHeight: 21,
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
  },
  reviewText: {
    flex: 1,
    color: COLORS_NEW.textSecondary,
    fontSize: 17,
    letterSpacing: -0.68,
    lineHeight: 25,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'left',
  },
});
