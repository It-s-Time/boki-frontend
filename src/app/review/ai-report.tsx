import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/shared/constants/colors';
import ScreenHeader from '@/shared/components/ScreenHeader';

const DONUT_SIZE = 200;
const DONUT_STROKE = 36;
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
    {
      title: '거래 시간대 제한',
      description:
        '해당 시간대 거래의 손실률이 평균 대비 2배 높아서 오후 2-4시에는 거래를 자제하여 감정적 매매를 방지하는 것을 추천드립니다.',
    },
    {
      title: '섹터 분산 투자',
      description:
        '단일 종목 비중을 20% 이하로 유지하여 리스크를 분산하고 안정적인 수익을 추구하는 것을 추천드립니다.',
    },
    {
      title: '주간 거래 횟수 제한',
      description:
        '주간 거래 횟수를 5회 이하로 제한하여 충동적인 매매를 방지하는 것을 추천드립니다.',
    },
    {
      title: '진입 전 비중 확인',
      description:
        '포트폴리오 비중을 진입 전에 반드시 확인하여 과도한 집중 투자를 방지하는 것을 추천드립니다.',
    },
  ],
};

export default function AiReportScreen() {
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
              strokeLinecap="butt"
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

        <View style={styles.sectionDivider} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>추천 매매 원칙</Text>
        </View>
        <View style={styles.recommendGrid}>
          {MOCK_REPORT.recommendedPrinciples.map((item, i) => (
            <View key={i} style={styles.recommendCard}>
              <View style={styles.recommendCardHeader}>
                <View style={styles.numberCircle}>
                  <Text style={styles.numberText}>{i + 1}</Text>
                </View>
                <Text style={styles.recommendTitle}>{item.title}</Text>
              </View>
              <Text style={styles.recommendDesc}>{item.description}</Text>
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
    width: SCREEN_WIDTH * 0.6,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.iconBox,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: COLORS.textSecondary,
  },
  sectionDivider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 16,
  },

  card: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 18,
    gap: 12,
    marginTop: 16,
  },

  recommendGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  recommendCard: {
    width: '48%',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    gap: 10,
    marginBottom: 16,
  },

  recommendCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  recommendTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: COLORS.textPrimary,
  },

  recommendDesc: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: COLORS.textPrimary,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  numberCircle: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  numberText: {
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
    color: COLORS.box,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
});
