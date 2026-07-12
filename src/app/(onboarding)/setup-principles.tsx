import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS_NEW } from '@/shared/constants/colors';
import BackHeader from '@/shared/components/BackHeader';
import PrimaryButton from '@/shared/components/PrimaryButton';
import ProgressBar from '@/features/review/components/ProgressBar';
import { PRINCIPLE_SETS } from '@/features/review/data';
import { PrincipleSet } from '@/features/review/types';
import ShortTermIcon from '../../../assets/icons/onboarding/event_note.svg';
import MidTermIcon from '../../../assets/icons/onboarding/android_cell.svg';
import LongTermIcon from '../../../assets/icons/onboarding/nature.svg';

const TOTAL_STEPS = 2;

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

interface TooltipPrincipleCardProps {
  set: PrincipleSet;
  dimOpacity: Animated.AnimatedInterpolation<number> | number;
  radioColor?: Animated.AnimatedInterpolation<string>;
}

function TooltipPrincipleCard({
  set,
  dimOpacity,
  radioColor,
}: TooltipPrincipleCardProps) {
  return (
    <View style={styles.innerCard}>
      <Animated.View style={{ opacity: dimOpacity }}>
        <View style={styles.titleRow}>
          <Text style={styles.cardName}>{set.name}</Text>
          <Animated.View
            style={[styles.radio, radioColor && { borderColor: radioColor }]}
          />
        </View>

        <Text style={styles.cardDescription} numberOfLines={1}>
          {set.description}
        </Text>

        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>매수 원칙 {set.buyCount}개</Text>
            <View style={styles.nextButton}>
              <Entypo
                name="chevron-thin-right"
                size={16}
                color={COLORS_NEW.textPrimary}
              />
            </View>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>매도 원칙 {set.sellCount}개</Text>
            <View style={styles.nextButton}>
              <Entypo
                name="chevron-thin-right"
                size={16}
                color={COLORS_NEW.textPrimary}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export default function SetupPrinciplesScreen() {
  const [step, setStep] = useState(0);
  const [expandedType, setExpandedType] = useState<HorizonType | null>(null);
  const dimAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (step !== 1) {
      dimAnim.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(dimAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.delay(600),
        Animated.timing(dimAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [step, dimAnim]);

  const dimOpacity = dimAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3],
  });

  const radioColor = dimAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#D6D6D8', COLORS_NEW.border],
  });

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
      return;
    }
    router.push('/(tabs)');
  };

  const handleBack = () => {
    if (step === 1) {
      setStep(0);
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerWrap}>
        <BackHeader onBack={handleBack} />
      </View>

      <View style={styles.progressWrap}>
        <ProgressBar total={TOTAL_STEPS} current={step} />
      </View>

      <View style={styles.body}>
        {step === 0 ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>보키가 제공하는 매매원칙이에요</Text>

            {PRINCIPLE_TYPES.map((item) => {
              const isExpanded = expandedType === item.type;
              return (
                <View key={item.type}>
                  <Pressable
                    style={styles.card}
                    onPress={() =>
                      setExpandedType(isExpanded ? null : item.type)
                    }
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
          </ScrollView>
        ) : (
          <>
            <Text style={styles.title}>매매원칙을 설정해 보세요</Text>

            <View style={styles.groupWrap}>
              {PRINCIPLE_SETS.map((set, i) => (
                <TooltipPrincipleCard
                  key={set.id}
                  set={set}
                  dimOpacity={i !== 0 ? dimOpacity : 1}
                  radioColor={i === 0 ? radioColor : undefined}
                />
              ))}
            </View>

            <Text style={styles.helperText}>
              본인의 코인 매매 스타일에 맞게
            </Text>
            <Text style={styles.helperText}>
              자유롭게 설정해주세요. 추후 수정도 가능합니다.
            </Text>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="다음" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
    paddingHorizontal: 24,
  },
  headerWrap: {
    paddingTop: 20,
  },
  progressWrap: {
    marginTop: 20,
  },
  body: {
    flex: 1,
    marginTop: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
  },
  title: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 24,
    marginBottom: 28,
  },
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
    marginBottom: 4,
  },
  cardSubtitle: {
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  detail: {
    backgroundColor: COLORS_NEW.lightGray,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  detailSectionTitle: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    marginBottom: 12,
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
    fontSize: 13,
  },
  detailText: {
    flex: 1,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  groupWrap: {
    backgroundColor: COLORS_NEW.lightGray,
    borderRadius: 20,
    padding: 12,
    gap: 12,
  },
  innerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 20,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 5,
    borderColor: '#D6D6D8',
  },
  cardDescription: {
    fontSize: 16,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 20,
  },
  badges: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS_NEW.lightGray,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 6,
  },
  badgeText: {
    fontSize: 16,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
  },
  nextButton: {
    width: 28,
    height: 28,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperText: {
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    paddingBottom: 24,
    paddingTop: 8,
  },
});
