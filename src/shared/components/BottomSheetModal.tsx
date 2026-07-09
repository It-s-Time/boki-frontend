import { COLORS_NEW } from '@/shared/constants/colors';
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  sheetStyle?: StyleProp<ViewStyle>;
}

export default function BottomSheetModal({
  visible,
  onClose,
  children,
  sheetStyle,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, sheetStyle]} onPress={() => {}}>
          <View style={styles.handle} />
          {children}
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  handle: {
    alignSelf: 'center',
    width: 64,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS_NEW.handle,
    marginBottom: 12,
  },
});
