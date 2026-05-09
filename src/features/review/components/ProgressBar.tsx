import { COLORS } from '@/shared/constants/colors';
import { View, StyleSheet } from 'react-native';

interface Props {
  total: number;
  current: number;
}

export default function ProgressBar({ total, current }: Props) {
  return (
    <View style={styles.bar}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            i <= current ? styles.segmentFilled : styles.segmentEmpty,
            i === 0 && { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
            (i === current || i === total - 1) && {
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  segment: {
    flex: 1,
    height: 4,
  },
  segmentFilled: {
    backgroundColor: COLORS.textSecondary,
  },
  segmentEmpty: {
    backgroundColor: COLORS.background,
  },
});
