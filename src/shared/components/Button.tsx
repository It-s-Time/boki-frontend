import { COLORS } from '@/shared/constants/colors';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export default function Button({ label, onPress, variant = 'primary', disabled = false }: Props) {
  const bg = disabled || variant === 'secondary' ? COLORS.iconBox : COLORS.primary;

  return (
    <Pressable
      style={[styles.button, { backgroundColor: bg }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 20,
    letterSpacing: -0.8,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },
});
