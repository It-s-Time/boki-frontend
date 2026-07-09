import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS_NEW } from '@/shared/constants/colors';
import BottomSheetModal from '@/shared/components/BottomSheetModal';
import PrimaryButton from '@/shared/components/PrimaryButton';
import FinishIcon from '../../../../assets/finish.svg';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SyncSuccessModal({ visible, onClose }: Props) {
  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <View style={styles.headerRow}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={20} color={COLORS_NEW.border} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <FinishIcon width={140} height={140} />
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
    marginBottom: 12,
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
    gap: 20,
    paddingBottom: 32,
  },

  message: {
    fontSize: 18,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },
});
