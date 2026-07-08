import { COLORS_NEW } from '@/shared/constants/colors';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  style,
}: Props) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS_NEW.fab,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    opacity: 0.4,
  },

  buttonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
  },
});
