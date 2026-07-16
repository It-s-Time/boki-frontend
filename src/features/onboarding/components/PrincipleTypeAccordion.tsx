import { ReactNode, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS_NEW } from '@/shared/constants/colors';
import { keepWordsTogether } from '@/shared/utils/text';
import ShortTermIcon from '../../../../assets/icons/onboarding/event_note.svg';
import MidTermIcon from '../../../../assets/icons/onboarding/android_cell.svg';
import LongTermIcon from '../../../../assets/icons/onboarding/nature.svg';

type PrincipleKey = 'short' | 'middle' | 'long';

interface PrincipleGroup {
  key: PrincipleKey;
  title: string;
  period: string;
  icon: ReactNode;
  buy: string[];
  sell: string[];
}

const PRINCIPLE_GROUPS: PrincipleGroup[] = [
  {
    key: 'short',
    title: '단기 투자형',
    period: '1개월 이내',
    icon: <ShortTermIcon width={20} height={22} />,
    buy: [
      '급등 뉴스나 이슈 터진 직후 추격 매수 안 하기',
      '매수 전에 목표 수익률과 손절선을 미리 정하기',
      '한 번에 몰빵하지 않고 정해둔 금액만큼만 매수',
    ],
    sell: [
      '목표 수익률 도달하면 욕심 안 부리고 매도',
      '손절 선 닿으면 무조건 매도',
      '산 이유가 사라지면 바로 매도',
    ],
  },
  {
    key: 'middle',
    title: '중기 투자형',
    period: '1개월부터 6개월 이내',
    icon: <MidTermIcon width={22} height={17} />,
    buy: [
      '많이 떨어졌을 때 한 번에 사지 않고 나눠서 매수',
      '전체 자산의 일정 비율 이상은 코인에 안 넣기',
      '최근 급등한 코인은 일단 지켜보고 매수 보류',
    ],
    sell: [
      '정해둔 수익률 도달하면 일부 매도',
      '사고나서 생각이 바뀌면 비중 줄이기',
      '많이 빠질 때 손실 키우지 않고 일부 매도',
    ],
  },
  {
    key: 'long',
    title: '장기 투자형',
    period: '6개월 이상',
    icon: <LongTermIcon width={18} height={22} />,
    buy: [
      '잘 아는 코인, 믿는 코인만 사기',
      '매달 정해진 날짜에 정해진 금액만 사기',
      '가격 급등락에 흔들려서 추가 결정 안 하기',
    ],
    sell: [
      '목표한 기간이 되기 전에는 함부로 안 팔기',
      '급등 후 팔지 않고 처음 목표 도달할 때만 팔기',
      '급하게 돈이 필요한 상황 아니면 패닉셀 안 하기',
    ],
  },
];

export default function PrincipleTypeAccordion() {
  const [expandedKey, setExpandedKey] = useState<PrincipleKey | null>(null);

  return (
    <>
      {PRINCIPLE_GROUPS.map((group) => {
        const isExpanded = expandedKey === group.key;

        return (
          <View key={group.key}>
            <Pressable
              style={styles.card}
              onPress={() => setExpandedKey(isExpanded ? null : group.key)}
            >
              <View style={styles.iconCircle}>{group.icon}</View>
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{group.title}</Text>
                <Text style={styles.cardSubtitle}>{group.period}</Text>
              </View>
              <View style={styles.arrowCircle}>
                <Entypo
                  name={isExpanded ? 'chevron-thin-down' : 'chevron-thin-right'}
                  size={18}
                  color={COLORS_NEW.textPrimary}
                />
              </View>
            </Pressable>

            {isExpanded && (
              <View style={styles.detail}>
                <Text style={styles.detailSectionTitle}>매수</Text>
                {group.buy.map((line, i) => (
                  <View key={i} style={styles.detailRow}>
                    <View style={styles.detailIndexCircle}>
                      <Text style={styles.detailIndexText}>{i + 1}</Text>
                    </View>
                    <Text
                      style={styles.detailText}
                      lineBreakStrategyIOS="hangul-word"
                    >
                      {keepWordsTogether(line)}
                    </Text>
                  </View>
                ))}

                <View style={{ height: 16 }} />

                <Text style={styles.detailSectionTitle}>매도</Text>
                {group.sell.map((line, i) => (
                  <View key={i} style={styles.detailRow}>
                    <View style={styles.detailIndexCircle}>
                      <Text style={styles.detailIndexText}>{i + 1}</Text>
                    </View>
                    <Text
                      style={styles.detailText}
                      lineBreakStrategyIOS="hangul-word"
                    >
                      {keepWordsTogether(line)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: COLORS_NEW.lightGray,
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextWrap: {
    flex: 1,
  },
  arrowCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS_NEW.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  cardSubtitle: {
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    letterSpacing: -0.64,
  },
  detail: {
    backgroundColor: COLORS_NEW.lightGray,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  detailSectionTitle: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    letterSpacing: -0.72,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  detailIndexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS_NEW.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailIndexText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    letterSpacing: -0.56,
  },
  detailText: {
    flex: 1,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    letterSpacing: -0.64,
    lineHeight: 20,
  },
});
