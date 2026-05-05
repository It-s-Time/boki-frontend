import { COLORS } from '@/shared/constants/colors';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Entypo from '@expo/vector-icons/Entypo';
import { TradeType } from '../types';

LocaleConfig.locales.kr = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'kr';

type Props = {
  currentDate: string;
  selectedDate: string;
  tradeMarks: Record<string, TradeType[]>;
  onMonthChange: (date: string) => void;
  onDateSelect: (date: string) => void;
};

export default function TradeCalendar({
  currentDate,
  selectedDate,
  tradeMarks,
  onMonthChange,
  onDateSelect,
}: Props) {
  const moveMonth = (direction: 'prev' | 'next') => {
    const [year, month] = currentDate.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    onMonthChange(`${y}-${m}-01`);
  };

  return (
    <>
      <View style={styles.dayHeader}>
        <Pressable onPress={() => moveMonth('prev')}>
          <Entypo name="chevron-thin-left" size={22} color="black" />
        </Pressable>

        <Text style={styles.title}>
          {`${currentDate.slice(0, 4)}.${parseInt(currentDate.slice(5, 7))}`}
        </Text>

        <Pressable onPress={() => moveMonth('next')}>
          <Entypo name="chevron-thin-right" size={22} color="black" />
        </Pressable>
      </View>

      <View style={styles.card}>
        <Calendar
          key={currentDate.slice(0, 7)}
          renderHeader={() => null}
          current={currentDate}
          hideArrows
          hideExtraDays
          enableSwipeMonths
          onMonthChange={(month) => onMonthChange(month.dateString)}
          dayComponent={({ date, state }) => {
            if (!date) return null;

            const dateString = date.dateString;
            const isSelected = dateString === selectedDate;
            const dots = tradeMarks[dateString] ?? [];
            const isDisabled = state === 'disabled';
            const hasDot = dots.length > 0;

            return (
              <Pressable
                disabled={isDisabled}
                onPress={() => onDateSelect(dateString)}
                style={[styles.dayBox, isSelected && styles.selectedDayBox]}
              >
                <Text
                  style={[
                    styles.dayText,
                    isDisabled && styles.hiddenDayText,
                    !hasDot && styles.noDotText,
                    isSelected && styles.selectedDayText,
                  ]}
                >
                  {date.day}
                </Text>

                <View style={styles.dotRow}>
                  {!isDisabled &&
                    dots.map((type, index) => (
                      <View
                        key={`${type}-${index}`}
                        style={[
                          styles.dot,
                          {
                            backgroundColor:
                              type === 'buy' ? COLORS.buy : COLORS.sell,
                          },
                        ]}
                      />
                    ))}
                </View>
              </Pressable>
            );
          }}
          theme={{
            backgroundColor: COLORS.box,
            calendarBackground: COLORS.box,
            textSectionTitleColor: COLORS.textPrimary,
            textDayHeaderFontSize: 18,
            textDayHeaderFontFamily: 'Pretendard-SemiBold',
          }}
          style={styles.calendar}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    marginHorizontal: 16,
  },

  card: {
    backgroundColor: COLORS.box,
    borderRadius: 8,
    paddingHorizontal: 20,
  },

  calendar: {
    borderRadius: 8,
    paddingVertical: 8,
  },

  dayBox: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  selectedDayBox: {
    backgroundColor: COLORS.textPrimary,
  },

  dayText: {
    fontSize: 18,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },

  selectedDayText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
  },

  hiddenDayText: {
    color: 'transparent',
  },

  dotRow: {
    position: 'absolute',
    bottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginHorizontal: 1,
  },

  noDotText: {
    color: '#99A1AF',
    fontFamily: 'Pretendard-Light',
  },
});
