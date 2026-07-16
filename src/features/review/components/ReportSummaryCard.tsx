import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, FeDropShadow, Filter, Path } from 'react-native-svg';
import { COLORS_NEW } from '@/shared/constants/colors';
import { AiReport } from '../types';

const SCORE_HORIZONTAL = require('../../../../assets/icons/Frame 550.png');
const SCORE_VERTICAL = require('../../../../assets/icons/Frame 549.png');
const DETAIL_CARD_RADIUS = 24;
const DETAIL_NOTCH_RADIUS = 14;
// Extra canvas room so the drop-shadow filter isn't clipped at the card's
// own edges — same trick as journal.tsx's TicketCardBackground.
const DETAIL_SHADOW_MARGIN = 24;

interface Props {
  report: AiReport;
  // Defaults to the real screen's 26. Callers that shrink this card down
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

  const percent = Math.round((report.complianceRate ?? 0) * 100);
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
        Rank <Text style={styles.rankGrade}>{report.grade ?? '-'}</Text>
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
      <ReviewSection title="아쉬운 점" items={badPoints} />
    </View>
  );
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
        <Filter id="detailCardShadow" x="-50%" y="-50%" width="200%" height="200%">
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
          <Text style={styles.scorePercent}>{percent}</Text>
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

const styles = StyleSheet.create({
  detailCard: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingBottom: 26,
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
    color: COLORS_NEW.textPrimary,
    fontSize: 35,
    letterSpacing: -1.4,
    lineHeight: 45,
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
  },
  scoreUnit: {
    color: COLORS_NEW.textSecondary,
    fontSize: 17,
    letterSpacing: -0.68,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 8,
    marginLeft: 5,
  },
  rankText: {
    color: COLORS_NEW.textPrimary,
    fontSize: 24,
    letterSpacing: -0.96,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
    marginBottom: 22,
  },
  rankGrade: {
    color: COLORS_NEW.point,
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
