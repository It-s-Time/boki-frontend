import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS_NEW } from '@/shared/constants/colors';
import BackwardIcon from 'assets/icons/backward.svg';
import { AiReport } from '../types';

const SCORE_HORIZONTAL = require('../../../../assets/icons/Frame 550.png');
const SCORE_VERTICAL = require('../../../../assets/icons/Frame 549.png');
const MEMO_ICON = require('../../../../assets/icons/_레이어_1.png');
const MEMO_CHART_IMAGE = require('../../../../assets/icons/Rectangle 1430106783.png');
const MEMO_COIN_IMAGE = require('../../../../assets/icons/Rectangle 1430106784.png');
const DETAIL_CARD_RADIUS = 24;
const DETAIL_NOTCH_RADIUS = 14;

interface Props {
  report: AiReport;
  onBack: () => void;
}

export default function ReportDetail({ report, onBack }: Props) {
  const [memoVisible, setMemoVisible] = useState(false);
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.detailHeader}>
        <Pressable style={styles.headerCircle} onPress={onBack}>
          <BackwardIcon width={9} height={15} />
        </Pressable>
        <Text style={styles.headerTitle}>일지</Text>
        <Pressable style={styles.headerCircle} onPress={() => setMemoVisible(true)}>
          <Image source={MEMO_ICON} style={styles.memoHeaderIcon} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.detailContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={styles.detailCard}
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
      </ScrollView>

      <MemoModal visible={memoVisible} onClose={() => setMemoVisible(false)} />
    </SafeAreaView>
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
      width={width}
      height={height}
      style={styles.detailCardBackground}
    >
      <Path d={path} fill="#FFFFFF" stroke="#E9E9EC" strokeWidth={1} />
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
  headerTitle: {
    color: '#14151F',
    fontSize: 23,
    fontFamily: 'Pretendard-Regular',
  },
  scroll: {
    flex: 1,
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
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingBottom: 26,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
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
    borderColor: '#efefef',
    borderRadius: 15,
    backgroundColor: '#f2f2f5',
    paddingHorizontal: 15,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 16,
    letterSpacing: -0.6,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
    color: '#5e5e61',
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
