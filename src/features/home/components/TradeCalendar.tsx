import { COLORS_NEW } from '@/shared/constants/colors';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Entypo from '@expo/vector-icons/Entypo';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { TradeType } from '../types';

const DAY_SIZE = 44;

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
  return (
    <>
      <View style={styles.dayHeader}>
        <View style={styles.monthPill}>
          <Text style={styles.monthPillText}>
            {`${parseInt(currentDate.slice(5, 7))}월 ${currentDate.slice(0, 4)}`}
          </Text>
          <Entypo name="chevron-down" size={16} color={COLORS_NEW.border} />
        </View>
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
            const hasBuy = dots.includes('buy');
            const hasSell = dots.includes('sell');
            const isMixed = hasBuy && hasSell;
            const hasDot = dots.length > 0;

            const dayBoxColorStyle = isSelected
              ? styles.selectedDayBox
              : isMixed
                ? null
                : hasBuy
                  ? { backgroundColor: COLORS_NEW.lightRed }
                  : hasSell
                    ? { backgroundColor: COLORS_NEW.lightBlue }
                    : styles.emptyDayBox;

            return (
              <Pressable
                disabled={isDisabled}
                onPress={() => onDateSelect(dateString)}
                style={[styles.dayBox, dayBoxColorStyle]}
              >
                {isMixed && !isSelected && !isDisabled && (
                  <Svg
                    width={DAY_SIZE}
                    height={DAY_SIZE}
                    style={StyleSheet.absoluteFillObject}
                  >
                    <Defs>
                      <RadialGradient
                        id={`mixedGradient-${dateString}`}
                        cx="50%"
                        cy="50%"
                        r="50%"
                      >
                        <Stop offset="0%" stopColor={COLORS_NEW.lightRed} />
                        <Stop offset="100%" stopColor={COLORS_NEW.lightBlue} />
                      </RadialGradient>
                    </Defs>
                    <Circle
                      cx={DAY_SIZE / 2}
                      cy={DAY_SIZE / 2}
                      r={DAY_SIZE / 2}
                      fill={`url(#mixedGradient-${dateString})`}
                    />
                  </Svg>
                )}

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
              </Pressable>
            );
          }}
          theme={{
            backgroundColor: COLORS_NEW.background,
            calendarBackground: COLORS_NEW.background,
            textSectionTitleColor: COLORS_NEW.textPrimary,
            ...({
              'stylesheet.calendar.header': {
                dayHeader: {
                  marginTop: 2,
                  marginBottom: 7,
                  width: DAY_SIZE,
                  textAlign: 'center',
                  fontSize: 16,
                  fontFamily: 'Pretendard-SemiBold',
                  color: COLORS_NEW.textPrimary,
                },
              },
            } as object),
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

  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  monthPillText: {
    fontSize: 20,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
  },

  card: {
    backgroundColor: COLORS_NEW.background,
    borderRadius: 8,
  },

  calendar: {
    borderRadius: 8,
    paddingVertical: 8,
  },

  dayBox: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: DAY_SIZE / 2,
    overflow: 'hidden',
  },

  emptyDayBox: {
    backgroundColor: COLORS_NEW.lightGray,
  },

  selectedDayBox: {
    backgroundColor: '#000000',
  },

  dayText: {
    fontSize: 18,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },

  selectedDayText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
  },

  hiddenDayText: {
    color: 'transparent',
  },

  noDotText: {
    color: '#99A1AF',
    fontFamily: 'Pretendard-Light',
  },
});
