import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/shared/constants/colors';

type PrincipleKey = 'short' | 'middle' | 'long';

type PrincipleGroup = {
  key: PrincipleKey;
  title: string;
  period: string;
  icon: ImageSourcePropType;
  buy: string[];
  sell: string[];
};

type WeakPrinciple = {
  id: string;
  content: string;
  complianceRate: number;
};

const SHORT_ICON = require('../../../assets/images/principle-short.png');
const MIDDLE_ICON = require('../../../assets/images/principle-middle.png');
const LONG_ICON = require('../../../assets/images/principle-long.png');

const WEAK_PRINCIPLES: WeakPrinciple[] = [
  {
    id: 'chase-news',
    content: '급등 뉴스나 이슈 터진 직후 추격 매수 안 하기',
    complianceRate: 26,
  },
  {
    id: 'asset-ratio',
    content: '전체 자산의 일정 비율 이상은 코인에 안 넣기',
    complianceRate: 40,
  },
  {
    id: 'watch-surged',
    content: '최근 급등한 코인은 일단 지켜보고 매수 보류하기',
    complianceRate: 60,
  },
];

const PRINCIPLE_GROUPS: PrincipleGroup[] = [
  {
    key: 'short',
    title: '단기 투자형',
    period: '1개월 이내',
    icon: SHORT_ICON,
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
    icon: MIDDLE_ICON,
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
    icon: LONG_ICON,
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

export default function PrinciplesScreen() {
  const [expandedKey, setExpandedKey] = useState<PrincipleKey | null>(null);

  const toggleGroup = (key: PrincipleKey) => {
    setExpandedKey((current) => (current === key ? null : key));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>원칙</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <WeakPrinciplesTopThree />

        {PRINCIPLE_GROUPS.map((group) => {
          const expanded = expandedKey === group.key;
          const dimmed = expandedKey !== null && !expanded;

          return (
            <View key={group.key}>
              <PrincipleSummary
                group={group}
                expanded={expanded}
                dimmed={dimmed}
                onPress={() => toggleGroup(group.key)}
              />
              {expanded ? <PrincipleDetail group={group} /> : null}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function WeakPrinciplesTopThree() {
  return (
    <View style={styles.weakSection}>
      <Text style={styles.weakTitle}>못 지킨 Top 3를 신경 써주세요!</Text>
      <View style={styles.weakList}>
        {WEAK_PRINCIPLES.map((principle, index) => (
          <View key={principle.id} style={styles.weakItem}>
            <View style={styles.weakHeaderRow}>
              <View style={styles.weakNumber}>
                <Text style={styles.weakNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.weakContent}>{principle.content}</Text>
            </View>
            <View style={styles.weakProgressRow}>
              <View style={styles.weakProgressTrack}>
                <View
                  style={[
                    styles.weakProgressFill,
                    { width: `${principle.complianceRate}%` },
                  ]}
                />
              </View>
              <Text style={styles.weakRate}>
                준수율 {principle.complianceRate}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function PrincipleSummary({
  group,
  expanded,
  dimmed,
  onPress,
}: {
  group: PrincipleGroup;
  expanded: boolean;
  dimmed: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.summaryCard, dimmed && styles.dimmedCard]}
      onPress={onPress}
    >
      <View style={styles.iconBox}>
        <Image source={group.icon} style={styles.iconImage} />
      </View>

      <View style={styles.summaryTextBox}>
        <Text style={styles.summaryTitle}>{group.title}</Text>
        <Text style={styles.summaryPeriod}>{group.period}</Text>
      </View>

      <View style={styles.chevronButton}>
        <Feather
          name={expanded ? 'chevron-down' : 'chevron-right'}
          size={28}
          color={COLORS.textSecondary}
        />
      </View>
    </Pressable>
  );
}

function PrincipleDetail({ group }: { group: PrincipleGroup }) {
  return (
    <View style={styles.detailCard}>
      <RuleSection title="매수" rules={group.buy} />
      <RuleSection title="매도" rules={group.sell} />
    </View>
  );
}

function RuleSection({ title, rules }: { title: string; rules: string[] }) {
  return (
    <View style={styles.ruleSection}>
      <Text style={styles.ruleSectionTitle}>{title}</Text>
      <View style={styles.ruleList}>
        {rules.map((rule, index) => (
          <View key={rule} style={styles.ruleRow}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.ruleText}>{rule}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.box,
  },
  header: {
    height: 92,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 23,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 18,
    paddingBottom: 120,
  },
  weakSection: {
    marginBottom: 48,
    marginTop: -5,
  },
  weakTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    letterSpacing: -0.6,
    lineHeight: 32,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 19,
  },
  weakList: {
    gap: 26,
  },
  weakItem: {
    gap: 10,
  },
  weakHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weakNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  weakNumberText: {
    color: COLORS.box,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
  },
  weakContent: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 18,
    letterSpacing: -0.6,
    lineHeight: 26,
    fontFamily: 'Pretendard-Regular',
  },
  weakProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 38,
  },
  weakProgressTrack: {
    flex: 1,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#F2F2F5',
    overflow: 'hidden',
    marginRight: 16,
  },
  weakProgressFill: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: '#F79474',
  },
  weakRate: {
    width: 86,
    color: '#F79474',
    fontSize: 16,
    letterSpacing: -0.6,
    lineHeight: 24,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'right',
  },
  summaryCard: {
    minHeight: 94,
    borderRadius: 24,
    backgroundColor: '#F4F3F8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dimmedCard: {
    opacity: 0.42,
  },
  iconBox: {
    width: 71,
    height: 71,
    borderRadius: 20,
    backgroundColor: COLORS.box,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  summaryTextBox: {
    flex: 1,
    marginLeft: 18,
  },
  summaryTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: 28,
  },
  summaryPeriod: {
    marginTop: 6,
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 20,
  },
  chevronButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.box,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCard: {
    borderRadius: 24,
    backgroundColor: '#F4F3F8',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    marginBottom: 20,
  },
  ruleSection: {
    marginBottom: 30,
  },
  ruleSectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 16,
  },
  ruleList: {
    gap: 6,
  },
  ruleRow: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  ruleNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  ruleNumberText: {
    color: COLORS.box,
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
  },
  ruleText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 17,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 24,
  },
});
