import { COLORS_NEW } from '@/shared/constants/colors';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';
import AntDesign from '@expo/vector-icons/AntDesign';
import DateWheelPicker from '@/shared/components/DateWheelPicker';
import MonthCarousel from './MonthCarousel';
import type { MonthWindowMarks } from './MonthCarousel';

const MIN_YEAR = new Date().getFullYear() - 5;
const MAX_YEAR = new Date().getFullYear() + 1;

LocaleConfig.locales.kr = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'kr';

type Props = {
  currentDate: string;
  selectedDate: string;
  marks: MonthWindowMarks;
  onMonthChange: (date: string) => void;
  onDateSelect: (date: string) => void;
};

export default function TradeCalendar({
  currentDate,
  selectedDate,
  marks,
  onMonthChange,
  onDateSelect,
}: Props) {
  const currentYear = parseInt(currentDate.slice(0, 4));
  const currentMonth = parseInt(currentDate.slice(5, 7));

  const [showPicker, setShowPicker] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const handlePickerChange = (date: Date) => {
    onMonthChange(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`,
    );
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={styles.dayHeader}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <Pressable
          style={styles.monthPill}
          onPress={() => setShowPicker((v) => !v)}
        >
          <Text style={styles.monthPillText}>
            {`${currentMonth}월 ${currentYear}`}
          </Text>
          <AntDesign
            name={showPicker ? 'caret-up' : 'caret-down'}
            size={12}
            color={COLORS_NEW.border}
          />
        </Pressable>
      </View>

      <MonthCarousel
        currentDate={currentDate}
        selectedDate={selectedDate}
        marks={marks}
        onMonthChange={onMonthChange}
        onDateSelect={onDateSelect}
      />

      {showPicker && (
        <View style={[styles.datePickerOverlay, { top: headerHeight + 8 }]}>
          <View style={styles.datePickerPanel}>
            <DateWheelPicker
              value={new Date(currentYear, currentMonth - 1, 1)}
              onChange={handlePickerChange}
              minYear={MIN_YEAR}
              maxYear={MAX_YEAR}
              showDay={false}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },

  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  datePickerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  datePickerPanel: {
    backgroundColor: COLORS_NEW.background,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 0.7,
  },

  monthPillText: {
    fontSize: 20,
    letterSpacing: -0.8,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
  },
});
