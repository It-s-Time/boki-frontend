import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS_NEW } from '@/shared/constants/colors';
import BottomSheetModal from '@/shared/components/BottomSheetModal';
import PrimaryButton from '@/shared/components/PrimaryButton';
import FinishIcon from '../../../../assets/finish.svg';

interface Props {
  visible: boolean;
  onClose: () => void;
  bottomInset: number;
}

export default function SyncSuccessModal({
  visible,
  onClose,
  bottomInset,
}: Props) {
  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      sheetStyle={{ paddingBottom: bottomInset + 24 }}
    >
      <View style={styles.headerRow}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={20} color={COLORS_NEW.border} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <FinishIcon width={180} height={180} />
        <Text style={styles.message}>거래 내역 가져오기 성공</Text>
      </View>

      <PrimaryButton label="완료" onPress={onClose} />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    alignItems: 'center',
    gap: 16,
    paddingBottom: 32,
  },

  message: {
    fontSize: 22,
    letterSpacing: -0.88,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Medium',
  },
});
