import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/shared/constants/colors';
import ScreenHeader from '@/shared/components/ScreenHeader';

const DONUT_SIZE = 200;
const DONUT_STROKE = 22;
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

const MOCK_REPORT = {
  principleSetName: '나의 안정형 전략',
  score: 85,
  characterName: '냉철한 스나이퍼',
  tags: ['원칙준수율 A등급', '이성적인', '완벽한', '꼼꼼한', '엄격한'],
  goodPoints: [
    '손절가 설정을 철저히 지켜 손실을 방지했습니다.',
    'RSI 지표를 활용한 진입 타이밍이 우수합니다.',
  ],
  badPoints: [
    '포트폴리오 배분 원칙을 지키지 않아 리스크가 높습니다.',
    '거래 횟수 제한을 초과하여 수수료 부담이 증가했습니다.',
  ],
  recommendedPrinciples: [
    '섹터 분산 투자 원칙 추가 (단일 종목 20% 이하)',
    '주간 거래 횟수 5회 이하 제한',
    '진입 전 포트폴리오 비중 확인',
  ],
};

export default function AiReportScreen() {
  const router = useRouter();
  const { score } = MOCK_REPORT;

  const arcLength = DONUT_CIRCUMFERENCE * (score / 100);
  const gapLength = DONUT_CIRCUMFERENCE - arcLength;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader
        title={MOCK_REPORT.principleSetName}
        style={{ paddingHorizontal: 24 }}
      />
      <Text style={styles.headerSubtitle}>AI 분석 리포트</Text>

      <View style={styles.divider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.donutWrapper}>
          <Svg width={DONUT_SIZE} height={DONUT_SIZE}>
            <Circle
              cx={DONUT_SIZE / 2}
              cy={DONUT_SIZE / 2}
              r={DONUT_RADIUS}
              stroke={COLORS.button}
              strokeWidth={DONUT_STROKE}
              fill="none"
            />
            <Circle
              cx={DONUT_SIZE / 2}
              cy={DONUT_SIZE / 2}
              r={DONUT_RADIUS}
              stroke={COLORS.primary}
              strokeWidth={DONUT_STROKE}
              fill="none"
              strokeDasharray={`${arcLength} ${gapLength}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
            />
          </Svg>
          <View style={styles.donutCenter}>
            <Text style={styles.donutPercent}>{score}%</Text>
          </View>
        </View>

        <Text style={styles.characterName}>{MOCK_REPORT.characterName}</Text>

        <View style={styles.tagsRow}>
          {MOCK_REPORT.tags.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}># {tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>잘한 점</Text>
          {MOCK_REPORT.goodPoints.map((point, i) => (
            <View key={i} style={styles.listItem}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{i + 1}</Text>
              </View>
              <Text style={styles.listText}>{point}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>아쉬운 점</Text>
          {MOCK_REPORT.badPoints.map((point, i) => (
            <View key={i} style={styles.listItem}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{i + 1}</Text>
              </View>
              <Text style={styles.listText}>{point}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>추천 매매 원칙</Text>
          {MOCK_REPORT.recommendedPrinciples.map((principle, i) => (
            <View key={i} style={styles.listItem}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{i + 1}</Text>
              </View>
              <Text style={styles.listText}>{principle}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.box,
    paddingTop: 24,
  },
  headerSubtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    marginLeft: 68,
    marginTop: 8,
    marginBottom: 16,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  donutWrapper: {
    width: DONUT_SIZE,
    height: DONUT_SIZE,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPercent: {
    fontSize: 24,
    fontFamily: 'Pretendard-Medium',
    color: COLORS.textSecondary,
  },
  characterName: {
    marginTop: 20,
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: COLORS.textSecondary,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 20,
    gap: 12,
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: COLORS.textPrimary,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  numberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  numberText: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: COLORS.box,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Pretendard-Regular',
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
});
