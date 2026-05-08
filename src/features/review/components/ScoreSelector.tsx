import { COLORS } from '@/shared/constants/colors';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface Props {
  value: number | null;
  onChange: (n: number) => void;
}

export default function ScoreSelector({ value, onChange }: Props) {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.line} />
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            style={[styles.circle, value === n && styles.circleSelected]}
            onPress={() => onChange(n)}
          >
            <Text style={[styles.text, value === n && styles.textSelected]}>
              {n}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.labels}>
        <Text style={styles.label}>전혀 안 지킴</Text>
        <Text style={styles.label}>완벽히 지킴</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: COLORS.iconBox,
    zIndex: 0,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.iconBox,
    backgroundColor: COLORS.box,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  circleSelected: {
    borderColor: COLORS.textSecondary,
    backgroundColor: COLORS.textSecondary,
  },
  text: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Medium',
  },
  textSelected: {
    color: '#FFFFFF',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
  },
});
