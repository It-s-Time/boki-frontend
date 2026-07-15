import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import WheelPicker from '@/shared/components/WheelPicker';
import { COLORS_NEW } from '@/shared/constants/colors';

interface Props {
  value: Date;
  onChange: (date: Date) => void;
  minYear?: number;
  maxYear?: number;
  showDay?: boolean;
  itemHeight?: number;
  fontSize?: number;
  columnGap?: number;
  highlightInset?: number;
  highlightFull?: boolean;
}

const VISIBLE_COUNT = 3;

const daysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

export default function DateWheelPicker({
  value,
  onChange,
  minYear = new Date().getFullYear() - 5,
  maxYear = new Date().getFullYear(),
  showDay = true,
  itemHeight = 44,
  fontSize = 20,
  columnGap = 0,
  highlightInset = 24,
  highlightFull = false,
}: Props) {
  const highlightTop = (itemHeight * (VISIBLE_COUNT - 1)) / 2;
  const year = value.getFullYear();
  const month = value.getMonth() + 1;
  const day = value.getDate();

  const years = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i),
    [minYear, maxYear],
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(
    () => Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1),
    [year, month],
  );

  const updateDate = (nextYear: number, nextMonth: number, nextDay: number) => {
    const clampedDay = Math.min(nextDay, daysInMonth(nextYear, nextMonth));
    onChange(new Date(nextYear, nextMonth - 1, clampedDay));
  };

  return (
    <View style={styles.row}>
      {highlightFull && (
        <View
          style={[
            styles.highlight,
            { left: 0, right: 0, top: highlightTop, height: itemHeight },
          ]}
          pointerEvents="none"
        />
      )}
      <View style={[styles.wheels, { columnGap }]}>
        {!highlightFull && (
          <View
            style={[
              styles.highlight,
              {
                left: -highlightInset,
                right: -highlightInset,
                top: highlightTop,
                height: itemHeight,
              },
            ]}
            pointerEvents="none"
          />
        )}
        <WheelPicker
          items={years.map((y) => `${y}년`)}
          selectedIndex={years.indexOf(year)}
          onChange={(i) => updateDate(years[i], month, day)}
          visibleCount={VISIBLE_COUNT}
          itemHeight={itemHeight}
          fontSize={fontSize}
          showHighlight={false}
          style={styles.yearColumn}
        />
        <WheelPicker
          items={months.map((m) => `${m}월`)}
          selectedIndex={month - 1}
          onChange={(i) => updateDate(year, months[i], day)}
          visibleCount={VISIBLE_COUNT}
          itemHeight={itemHeight}
          fontSize={fontSize}
          showHighlight={false}
          style={styles.column}
        />
        {showDay && (
          <WheelPicker
            items={days.map((d) => `${d}일`)}
            selectedIndex={day - 1}
            onChange={(i) => updateDate(year, month, days[i])}
            visibleCount={VISIBLE_COUNT}
            itemHeight={itemHeight}
            fontSize={fontSize}
            showHighlight={false}
            style={styles.column}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  wheels: {
    flexDirection: 'row',
  },
  yearColumn: {
    flex: 0,
    width: 76,
  },
  column: {
    flex: 0,
    width: 56,
  },
  highlight: {
    position: 'absolute',
    borderRadius: 12,
    backgroundColor: COLORS_NEW.lightGray,
  },
});
