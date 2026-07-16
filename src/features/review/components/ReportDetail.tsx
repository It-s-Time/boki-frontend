import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackwardIcon from 'assets/icons/backward.svg';
import { COLORS_NEW } from '@/shared/constants/colors';
import { AiReport, Review } from '../types';
import ReportSummaryCard from './ReportSummaryCard';

const MEMO_ICON = require('../../../../assets/icons/_레이어_1.png');

interface Props {
  report: AiReport;
  review: Review | undefined;
  onBack: () => void;
}

export default function ReportDetail({ report, review, onBack }: Props) {
  const [memoVisible, setMemoVisible] = useState(false);

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
          <Image source={MEMO_ICON} style={styles.memoHeaderIcon} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.detailContent}
        showsVerticalScrollIndicator={false}
      >
        <ReportSummaryCard report={report} />
      </ScrollView>

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
            <Feather name="x" size={30} color={COLORS_NEW.textPrimary} />
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
    backgroundColor: COLORS_NEW.background,
  },
  headerTitle: {
    color: COLORS_NEW.textPrimary,
    fontSize: 23,
    letterSpacing: -0.92,
    fontFamily: 'Pretendard-Regular',
  },
  scroll: {
    flex: 1,
  },
  detailHeader: {
    height: 84,
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
  memoHeaderIcon: {
    width: 16,
    height: 22,
  },
  detailContent: {
    paddingHorizontal: 30,
    paddingTop: 24,
    paddingBottom: 120,
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
  memoClose: {
    position: 'absolute',
    left: 28,
    top: 28,
    width: 52,
    height: 52,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS_NEW.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS_NEW.background,
    zIndex: 2,
  },
  memoTitle: {
    color: COLORS_NEW.textPrimary,
    fontSize: 24,
    letterSpacing: -0.96,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 46,
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
