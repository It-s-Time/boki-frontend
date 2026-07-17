import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS_NEW } from '@/shared/constants/colors';

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel?: string;
  onCancel?: () => void;
}

// The app-wide styled stand-in for Alert.alert — mirrors the confirm modal
// first built for 마이페이지 로그아웃. Pass onCancel to get a two-button
// confirm/cancel dialog; omit it for a single-button informational alert.
export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  cancelLabel,
  onCancel,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel ?? onConfirm}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.actions}>
            {onCancel && (
              <Pressable style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>
                  {cancelLabel ?? '취소'}
                </Text>
              </Pressable>
            )}
            <Pressable style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  card: {
    borderRadius: 28,
    backgroundColor: COLORS_NEW.background,
    paddingHorizontal: 22,
    paddingTop: 40,
    paddingBottom: 22,
    alignItems: 'center',
  },
  title: {
    color: COLORS_NEW.textPrimary,
    fontSize: 20,
    letterSpacing: -0.8,
    lineHeight: 29,
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
  },
  message: {
    marginTop: 12,
    color: COLORS_NEW.textSecondary,
    fontSize: 15,
    letterSpacing: -0.6,
    lineHeight: 22,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    height: 58,
    borderRadius: 20,
    backgroundColor: COLORS_NEW.lightPurpleGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1,
    height: 58,
    borderRadius: 20,
    backgroundColor: COLORS_NEW.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: COLORS_NEW.textPrimary,
    fontSize: 17,
    letterSpacing: -0.68,
    fontFamily: 'Pretendard-Medium',
  },
  confirmButtonText: {
    color: COLORS_NEW.background,
    fontSize: 17,
    letterSpacing: -0.68,
    fontFamily: 'Pretendard-Medium',
  },
});
