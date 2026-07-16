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
    letterSpacing: -0.92,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  memoCard: {
    height: 610,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
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
  },
  memoTitle: {
    color: '#14151F',
    fontSize: 24,
    letterSpacing: -0.96,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 46,
  },
  memoText: {
    color: '#14151F',
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
