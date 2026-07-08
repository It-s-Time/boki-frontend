import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS_NEW } from '@/shared/constants/colors';
import PrimaryButton from '@/shared/components/PrimaryButton';
import ManualInputIcon from '../../../../assets/icons/input/input.svg';
import ApiInputIcon from '../../../../assets/icons/input/api.svg';

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
        <Pressable style={[styles.sheet, { paddingBottom: bottomInset + 24 }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>어떻게 거래내역을 추가할까요?</Text>
            <View style={styles.headerIcon}>
              <Feather name="calendar" size={20} color={COLORS_NEW.border} />
            </View>
          </View>

          <View style={styles.optionGroup}>
            {/* 수동 입력 */}
            <Pressable
              style={styles.option}
              onPress={() => {
                onClose();
                router.push('/input/manual');
              }}
            >
              <ManualInputIcon width={100} height={89} />
              <Text style={styles.optionTitle}>수동 입력</Text>
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
              <ApiInputIcon width={100} height={97} />
              <Text style={styles.optionTitle}>
                {IS_API_CONNECTED ? '연동 완료' : 'API 연동'}
              </Text>
            </Pressable>
          </View>

          <PrimaryButton label="취소" onPress={onClose} />
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
    backgroundColor: COLORS_NEW.background,
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: COLORS_NEW.lightGray,
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  title: {
    flex: 1,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
  },

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 20,
    paddingVertical: 24,
    gap: 16,
  },

  optionDisabled: {
    opacity: 0.5,
  },

  optionTitle: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
  },
});
