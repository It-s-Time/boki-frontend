import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS_NEW } from '@/shared/constants/colors';
import ShortTermIcon from '../../../../assets/icons/onboarding/event_note.svg';
import MidTermIcon from '../../../../assets/icons/onboarding/android_cell.svg';
import LongTermIcon from '../../../../assets/icons/onboarding/nature.svg';

type HorizonType = 'short' | 'mid' | 'long';

interface PrincipleTypeData {
  type: HorizonType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  buy: string[];
  sell: string[];
}

const PRINCIPLE_TYPES: PrincipleTypeData[] = [
  {
    type: 'short',
    title: '단기 투자형',
    subtitle: '1개월 이내',
    icon: <ShortTermIcon width={20} height={22} />,
    buy: [
      '많이 떨어졌을 때 한 번에 사지 않고 나눠서 매수',
      '전체 자산의 일정 비율 이상은 코인에 안 넣기',
      '최근 급등한 코인은 일단 지켜보고 매수 보류',
    ],
    sell: [
      '정해둔 수익률 도달하면 일부 매도',
      '사고나서 생각이 봐뀌면 비중 줄이기',
      '많이 빠질 때 손실 키우지 않고 일부 매도',
    ],
  },
  {
    type: 'mid',
    title: '중기 투자형',
    subtitle: '1개월부터 6개월 이내',
    icon: <MidTermIcon width={22} height={17} />,
    buy: [
      '분할 매수로 평균 단가를 낮추기',
      '전체 자산의 일정 비율 이상은 코인에 안 넣기',
      '재무/로드맵을 확인한 코인만 매수',
    ],
    sell: [
      '정해둔 목표 수익률 도달하면 일부 매도',
      '펀더멘털이 훼손되면 비중 줄이기',
      '보유 기간 6개월 초과 시 재검토',
    ],
  },
  {
    type: 'long',
    title: '장기 투자형',
    subtitle: '6개월 이상',
    icon: <LongTermIcon width={18} height={22} />,
    buy: [
      '시장 전체가 하락할 때 분할 매수',
      '전체 자산의 일정 비율 이상은 코인에 안 넣기',
      '단기 시세에 흔들리지 않고 계획대로 매수',
    ],
    sell: [
      '투자 목적을 달성했을 때만 매도',
      '펀더멘털이 훼손되면 비중 줄이기',
      '단기 급등에 흔들리지 않고 계획대로 매도',
    ],
  },
];

export default function PrincipleTypeAccordion() {
  const [expandedType, setExpandedType] = useState<HorizonType | null>(null);

  return (
    <>
      {PRINCIPLE_TYPES.map((item) => {
        const isExpanded = expandedType === item.type;
        return (
          <View key={item.type}>
            <Pressable
              style={styles.card}
              onPress={() => setExpandedType(isExpanded ? null : item.type)}
            >
              <View style={styles.iconCircle}>{item.icon}</View>
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons
                name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color={COLORS_NEW.border}
              />
            </Pressable>

            {isExpanded && (
              <View style={styles.detail}>
                <Text style={styles.detailSectionTitle}>매수</Text>
                {item.buy.map((line, i) => (
                  <View key={i} style={styles.detailRow}>
                    <View style={styles.detailIndexCircle}>
                      <Text style={styles.detailIndexText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.detailText}>{line}</Text>
                  </View>
                ))}

                <View style={{ height: 16 }} />

                <Text style={styles.detailSectionTitle}>매도</Text>
                {item.sell.map((line, i) => (
                  <View key={i} style={styles.detailRow}>
                    <View style={styles.detailIndexCircle}>
                      <Text style={styles.detailIndexText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.detailText}>{line}</Text>
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
    marginBottom: 8,
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
