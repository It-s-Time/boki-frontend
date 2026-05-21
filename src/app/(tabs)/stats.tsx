import { COLORS } from '@/shared/constants/colors';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import Logo from 'assets/logo.svg';

const gradeData = [
  { grade: 'S', count: 2, height: 18, active: false },
  { grade: 'A', count: 8, height: 84, active: false },
  { grade: 'B', count: 10, height: 114, active: true },
  { grade: 'C', count: 3, height: 30, active: false },
  { grade: 'F', count: 2, height: 18, active: false },
];

const strongPrinciples = [
  { title: '손절가 -3% 설정', percent: 95 },
  { title: '목표가 도달 시 익절', percent: 92 },
  { title: '손절가 도달 시 청산', percent: 90 },
];

const weakPrinciples = [
  { title: '자산 10% 이하 투자', percent: 45 },
  { title: '하루 최대 2회 거래', percent: 52 },
  { title: '손실 후 추가 매수 금지', percent: 38 },
];

function DonutChart() {
  const size = 176;
  const strokeWidth = 36;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = 0.92;

  return (
    <View style={styles.donutWrap}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.button}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference * percent} ${circumference}`}
          strokeLinecap="butt"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>

      <View style={styles.donutTextBox}>
        <Text style={styles.donutPercent}>92%</Text>
        <Text style={styles.donutGrade}>우수</Text>
      </View>
    </View>
  );
}

function GradeCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>등급 분포</Text>
          <Text style={styles.cardMeta}>총 25회 거래</Text>
        </View>
        <View style={styles.gradeSummary}>
          <Text style={styles.modeGradeLabel}>최빈 등급</Text>
          <Text style={styles.summaryGrade}>B</Text>
        </View>
      </View>

      <View style={styles.barChart}>
        {gradeData.map((item) => (
          <View key={item.grade} style={styles.barItem}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    height: item.height,
                    backgroundColor: item.active
                      ? COLORS.primary
                      : '#B9C0CD',
                  },
                ]}
              />
            </View>
            <Text style={styles.gradeLabel}>{item.grade}</Text>
            <Text style={styles.countLabel}>{item.count}개</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function PrincipleCard({
  title,
  average,
  items,
}: {
  title: string;
  average: string;
  items: typeof strongPrinciples;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.principleCardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.principleAverage}>평균 {average}</Text>
      </View>

      <View style={styles.principleList}>
        {items.map((item, index) => (
          <View key={item.title} style={styles.principleRow}>
            <View style={styles.rankCircle}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <View style={styles.principleContent}>
              <View style={styles.principleHeader}>
                <Text style={styles.principleName}>{item.title}</Text>
                <Text style={styles.principlePercent}>{item.percent}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.percent}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Logo width={88} height={56} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>최근 일주일 평균, 원칙 준수율</Text>
        <DonutChart />

        <View style={styles.divider} />
        <GradeCard />

        <View style={styles.divider} />
        <Text style={styles.detailSectionTitle}>원칙별 상세 분석</Text>
        <PrincipleCard
          title="잘 지킨 원칙"
          average="92%"
          items={strongPrinciples}
        />
        <PrincipleCard
          title="개선이 필요한 원칙"
          average="45%"
          items={weakPrinciples}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 18,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    marginBottom: 18,
  },
  detailSectionTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    letterSpacing: 0,
    textAlign: 'left',
    marginBottom: 18,
  },
  donutWrap: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  donutTextBox: {
    position: 'absolute',
    alignItems: 'center',
  },
  donutPercent: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 30,
  },
  donutGrade: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.box,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 15,
  },
  cardMeta: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    marginTop: 6,
  },
  principleCardHeader: {
    gap: 4,
  },
  principleAverage: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
  },
  gradeSummary: {
    alignItems: 'flex-end',
  },
  modeGradeLabel: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 21,
    textAlign: 'right',
    marginTop: -3,
  },
  summaryGrade: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 13,
    marginTop: 8,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barItem: {
    width: 52,
    alignItems: 'center',
  },
  barTrack: {
    width: 52,
    height: 114,
    justifyContent: 'flex-end',
    backgroundColor: '#F5F4F9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  gradeLabel: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    marginTop: 10,
  },
  countLabel: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    marginTop: 8,
  },
  principleList: {
    gap: 12,
    marginTop: 16,
  },
  principleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textSecondary,
  },
  rankText: {
    color: COLORS.box,
    fontFamily: 'Pretendard-Bold',
    fontSize: 10,
  },
  principleContent: {
    flex: 1,
  },
  principleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  principleName: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 21,
    textAlign: 'left',
  },
  principlePercent: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.textSecondary,
    borderRadius: 999,
  },
});
