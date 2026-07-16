import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS_NEW } from '@/shared/constants/colors';
import PrimaryButton from '@/shared/components/PrimaryButton';
import BottomSheetModal from '@/shared/components/BottomSheetModal';
import { useApiStore } from '@/store/apiStore';
import ManualInputIcon from '../../../../assets/icons/input/input.svg';
import ApiInputIcon from '../../../../assets/icons/input/api.svg';

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
  const isApiConnected = useApiStore((s) => s.isApiConnected);

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      sheetStyle={{ paddingBottom: bottomInset + 24 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>어떻게 거래내역을 추가할까요?</Text>
        {/* <View style={styles.headerIcon}>
          <Feather name="calendar" size={20} color={COLORS_NEW.border} />
        </View> */}
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
          <View style={styles.iconWrapper}>
            <ManualInputIcon width={127} height={120} />
          </View>
          <Text style={styles.optionTitle}>수동 입력</Text>
        </Pressable>

        {/* API 연동 */}
        <Pressable
          style={[styles.option, isApiConnected && styles.optionDisabled]}
          disabled={isApiConnected}
          onPress={() => {
            onClose();
            router.push('/api-key');
          }}
        >
          <View style={styles.iconWrapper}>
            <ApiInputIcon width={127} height={104} />
          </View>
          <Text style={styles.optionTitle}>
            {isApiConnected ? '연동 완료' : 'API 연동'}
          </Text>
        </Pressable>
      </View>

      <PrimaryButton label="취소" onPress={onClose} />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 8,
    fontSize: 22,
    letterSpacing: -0.88,
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
    gap: 16,
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

  iconWrapper: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionTitle: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    letterSpacing: -0.72,
  },
});
