import { COLORS } from '@/shared/constants/colors';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Entypo from '@expo/vector-icons/Entypo';
import Logo from 'assets/logo.svg';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

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
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'kr';

type TradeType = 'buy' | 'sell';

const tradeMarks: Record<string, TradeType[]> = {
  '2026-05-18': ['buy'],
  '2026-05-19': ['buy'],
  '2026-05-23': ['sell'],
  '2026-05-24': ['buy', 'sell'],
  '2026-05-28': ['buy', 'sell'],
};

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState('2026-05-01');
  const [selectedDate, setSelectedDate] = useState('2026-05-29');

  const moveMonth = (direction: 'prev' | 'next') => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(date.toISOString().slice(0, 10));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Logo width={88} height={56} />
        <View style={styles.iconRow}>
          <FontAwesome6 name="bell" size={24} color={COLORS.textPrimary} />
          <FontAwesome name="refresh" size={24} color={COLORS.textPrimary} />
        </View>
      </View>
      {/* 달력 헤더 */}
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

      {/* 캘린더 카드 */}
      <View style={styles.card}>
        <Calendar
          renderHeader={() => null}
          current={currentDate}
          hideArrows
          hideExtraDays
          enableSwipeMonths
          onMonthChange={(month) => {
            setCurrentDate(month.dateString);
          }}
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
                onPress={() => setSelectedDate(dateString)}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },

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
