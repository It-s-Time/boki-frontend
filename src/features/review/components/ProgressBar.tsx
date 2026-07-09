import { COLORS_NEW } from '@/shared/constants/colors';
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
            i === 0 && { borderTopLeftRadius: 999, borderBottomLeftRadius: 999 },
            (i === current || i === total - 1) && {
              borderTopRightRadius: 999,
              borderBottomRightRadius: 999,
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
  },
  segment: {
    flex: 1,
    height: 4,
  },
  segmentFilled: {
    backgroundColor: COLORS_NEW.fab,
  },
  segmentEmpty: {
    backgroundColor: COLORS_NEW.lightGray,
  },
});
