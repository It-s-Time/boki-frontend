import { Feather } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import BackwardIcon from 'assets/icons/backward.svg';
import MemoIcon from 'assets/icons/log2.svg';
import { COLORS_NEW } from '@/shared/constants/colors';
import { AiReport, Review } from '../types';
import ReportSummaryCard from './ReportSummaryCard';

const HEADER_HEIGHT = 84;
const CONTENT_HORIZONTAL_PADDING = 30;
const CONTENT_TOP_PADDING = 12;
const CONTENT_BOTTOM_PADDING = 24;
// Floor so the shrink-to-fit never renders text illegibly small on a report
// with an unusually long good/bad-points list.
const MIN_CARD_SCALE = 0.6;
const CARD_POP_SPRING = { bounciness: 12, speed: 14 };

interface Props {
  report: AiReport;
  review: Review | undefined;
  onBack: () => void;
}

export default function ReportDetail({ report, review, onBack }: Props) {
  const [memoVisible, setMemoVisible] = useState(false);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const cardWidth = windowWidth - CONTENT_HORIZONTAL_PADDING * 2;
  const availableHeight = Math.max(
    windowHeight -
      insets.top -
      insets.bottom -
      HEADER_HEIGHT -
      CONTENT_TOP_PADDING -
      CONTENT_BOTTOM_PADDING,
    0,
  );
  // Only ever shrinks (capped at 1) — a report short enough to already fit
  // renders at its natural size instead of being stretched up to fill space.
  const scale =
    naturalHeight > 0 && availableHeight > 0
      ? Math.max(Math.min(availableHeight / naturalHeight, 1), MIN_CARD_SCALE)
      : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.detailHeader}>
        <Pressable style={styles.headerCircle} onPress={onBack}>
          <BackwardIcon width={9} height={15} />
        </Pressable>
        <Text style={styles.headerTitle}>일지</Text>
        <Pressable
          style={styles.headerCircle}
          onPress={() => setMemoVisible(true)}
        >
          <MemoIcon width={16} height={22} />
        </Pressable>
      </View>

      <View style={styles.detailContent}>
        {/* Off-screen copy purely to measure the card's natural height. */}
        <View
          style={[styles.measureWrap, { width: cardWidth }]}
          pointerEvents="none"
          onLayout={(event) =>
            setNaturalHeight(event.nativeEvent.layout.height)
          }
        >
          <ReportSummaryCard report={report} />
        </View>

        {scale > 0 && (
          <View
            style={{
              width: cardWidth,
              height: naturalHeight * scale,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: cardWidth,
                height: naturalHeight,
                transform: [{ scale }],
              }}
            >
              <ReportSummaryCard report={report} />
            </View>
          </View>
        )}
      </View>

      <MemoModal
        visible={memoVisible}
        review={review}
        onClose={() => setMemoVisible(false)}
      />
    </SafeAreaView>
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
  const cardScale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (visible) {
      cardScale.setValue(0.85);
      Animated.spring(cardScale, {
        toValue: 1,
        useNativeDriver: true,
        ...CARD_POP_SPRING,
      }).start();
    }
  }, [visible, cardScale]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <Animated.View
          style={[styles.memoCard, { transform: [{ scale: cardScale }] }]}
        >
          <View style={styles.memoHeader}>
            <Pressable style={styles.memoClose} onPress={onClose}>
              <Feather name="x" size={20} color={COLORS_NEW.textPrimary} />
            </Pressable>
            <Text style={styles.memoTitle}>메모</Text>
            <View style={styles.memoHeaderSpacer} />
          </View>
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
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
  },
  headerTitle: {
    color: COLORS_NEW.textPrimary,
    fontSize: 23,
    letterSpacing: -0.92,
    fontFamily: 'Pretendard-Regular',
  },
  detailHeader: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  headerCircle: {
    width: 52,
    height: 52,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS_NEW.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS_NEW.background,
  },
  detailContent: {
    flex: 1,
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    paddingTop: CONTENT_TOP_PADDING,
    paddingBottom: CONTENT_BOTTOM_PADDING,
    justifyContent: 'flex-start',
  },
  // Rendered off-screen at the real card width purely to measure its
  // natural (unscaled) height via onLayout.
  measureWrap: {
    position: 'absolute',
    left: -9999,
    top: 0,
    opacity: 0,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  memoCard: {
    height: 610,
    borderRadius: 34,
    backgroundColor: COLORS_NEW.background,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
  },
  memoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 46,
  },
  memoClose: {
    width: 52,
    height: 52,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS_NEW.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS_NEW.background,
  },
  memoTitle: {
    color: COLORS_NEW.textPrimary,
    fontSize: 24,
    letterSpacing: -0.96,
    fontFamily: 'Pretendard-SemiBold',
  },
  memoHeaderSpacer: {
    width: 52,
  },
  memoText: {
    color: COLORS_NEW.textPrimary,
    fontSize: 20,
    letterSpacing: -0.8,
    lineHeight: 34,
    fontFamily: 'Pretendard-Regular',
  },
  memoImageRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 'auto',
  },
  memoImage: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
  },
});
