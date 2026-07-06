import { router } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/shared/constants/colors';
import Button from '@/shared/components/Button';

const IS_API_CONNECTED = false;

interface Props {
  visible: boolean;
  onClose: () => void;
  bottomInset: number;
}

export default function InputOptionsModal({
  visible,
  onClose,
  bottomInset,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: bottomInset }]}>
          <Text style={styles.title}>거래 내역 입력</Text>

          <View style={styles.optionGroup}>
            {/* 수동 입력 */}
            <Pressable
              style={styles.option}
              onPress={() => {
                onClose();
                router.push('/input/manual');
              }}
            >
              <Text style={styles.optionTitle}>수동 입력</Text>
              <Text style={styles.optionDesc}>
                거래 내역을 직접 입력합니다
              </Text>
            </Pressable>

            {/* API 연동 */}
            <Pressable
              style={[styles.option, IS_API_CONNECTED && styles.optionDisabled]}
              disabled={IS_API_CONNECTED}
              onPress={() => {
                onClose();
                router.push('/api-key');
              }}
            >
              <Text style={[styles.optionTitle]}>
                {IS_API_CONNECTED
                  ? '업비트 API가 이미 연동되어 있습니다.'
                  : 'API 연동'}
              </Text>
              <Text style={styles.optionDesc}>
                {IS_API_CONNECTED
                  ? '거래 내역을 자동으로 불러옵니다.'
                  : '업비트 API로 자동 동기합니다.'}
              </Text>
            </Pressable>
          </View>
          <Button label="취소" onPress={onClose} variant="secondary" />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: COLORS.box,
    padding: 24,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    gap: 20,
  },
  title: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22,
  },
  optionGroup: {
    overflow: 'hidden',
    gap: 12,
  },
  option: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    gap: 4,
  },
  optionDisabled: {
    backgroundColor: COLORS.selectedBox,
  },
  optionTitle: {
    color: '#000000',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
  },
  optionDesc: {
    color: '#6A7282',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
  },
});
