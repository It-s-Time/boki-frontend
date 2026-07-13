import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS_NEW } from '@/shared/constants/colors';
import BackwardIcon from 'assets/icons/backward.svg';
import { AiReport, Review } from '../types';

const SCORE_HORIZONTAL = require('../../../../assets/icons/Frame 550.png');
const SCORE_VERTICAL = require('../../../../assets/icons/Frame 549.png');
const MEMO_ICON = require('../../../../assets/icons/_레이어_1.png');

interface Props {
  report: AiReport;
  review: Review | undefined;
  onBack: () => void;
}

export default function ReportDetail({ report, review, onBack }: Props) {
  const [memoVisible, setMemoVisible] = useState(false);

  const percent = Math.round((report.complianceRate ?? 0) * 100);
  const hashtags = report.hashtags ?? [];
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
        <View style={styles.detailCard}>
          <TicketDetailNotch side="left" />
          <TicketDetailNotch side="right" />
          <ScoreBurst percent={percent} />
          <Text style={styles.rankText}>
            Rank <Text style={styles.rankGrade}>{report.grade ?? '-'}</Text>
          </Text>

          <View style={styles.tagWrap}>
            {hashtags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}># {tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.dashedLine} />

          <ReviewSection title="잘한 점" items={goodPoints} />
          <ReviewSection title="아쉬운 점" items={badPoints} />
          {report.recommendedRule && (
            <RecommendedRuleSection rule={report.recommendedRule} />
          )}
        </View>
      </ScrollView>

      <MemoModal
        visible={memoVisible}
        review={review}
        onClose={() => setMemoVisible(false)}
      />
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

function RecommendedRuleSection({
  rule,
}: {
  rule: { type: string; content: string };
}) {
  return (
    <View style={styles.reviewSection}>
      <Text style={styles.reviewTitle}>추천 원칙</Text>
      <View style={styles.recommendedTag}>
        <Text style={styles.recommendedTagText}>{rule.type}</Text>
      </View>
      <Text style={styles.recommendedContent}>{rule.content}</Text>
    </View>
  );
}

function MemoModal({
  visible,
  review,
  onClose,
}: {
  visible: boolean;
  review: Review | undefined;
  onClose: () => void;
}) {
  const imageUrls = review?.imageUrls ?? [];

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
            {review?.content || '작성된 메모가 없어요'}
          </Text>
          {imageUrls.length > 0 && (
            <View style={styles.memoImageRow}>
              {imageUrls.map((url) => (
                <Image
                  key={url}
                  source={{ uri: url }}
                  style={styles.memoImage}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
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
  recommendedTag: {
    alignSelf: 'flex-start',
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F5',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  recommendedTagText: {
    color: '#5E5E61',
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
  },
  recommendedContent: {
    color: '#5E5E61',
    fontSize: 17,
    letterSpacing: -0.6,
    lineHeight: 25,
    fontFamily: 'Pretendard-Regular',
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
