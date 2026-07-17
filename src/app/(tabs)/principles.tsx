import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS_NEW } from '@/shared/constants/colors';
import { keepWordsTogether } from '@/shared/utils/text';
import BackHeader from '@/shared/components/BackHeader';
import PrincipleTypeAccordion from '@/features/onboarding/components/PrincipleTypeAccordion';
import { useWorstRules } from '@/features/review/hooks/useReview';
import type { WorstRule } from '@/features/review/types';

export default function PrinciplesScreen() {
  const { data: worstRules } = useWorstRules();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <BackHeader title="원칙" hideBackButton />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {worstRules && worstRules.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>가장 많이 놓친 원칙</Text>
            <Text style={styles.sectionSubtitle}>
              복기하고 다음에는 더 잘 지켜봐요.
            </Text>
            <WeakPrinciplesTopThree rules={worstRules} />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>나의 투자 유형</Text>
          <Text style={styles.sectionSubtitle}>
            투자 성향에 맞는 원칙을 확인해보세요.
          </Text>
          <PrincipleTypeAccordion />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function WeakPrinciplesTopThree({ rules }: { rules: WorstRule[] }) {
  return (
    <View style={styles.weakList}>
      {rules.map((rule, index) => {
        const percent = Math.round(rule.complianceRate);

        return (
          <View key={rule.content} style={styles.weakItem}>
            <View style={styles.weakNumber}>
              <Text style={styles.weakNumberText}>{index + 1}</Text>
            </View>

            <View style={styles.weakBody}>
              <View style={styles.weakHeaderRow}>
                <Text
                  style={styles.weakContent}
                  lineBreakStrategyIOS="hangul-word"
                >
                  {keepWordsTogether(rule.content)}
                </Text>
                <Text style={styles.weakRate}>{percent}%</Text>
              </View>
              <View style={styles.weakProgressTrack}>
                <View
                  style={[styles.weakProgressFill, { width: `${percent}%` }]}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 18,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 48,
  },
  sectionTitle: {
    color: COLORS_NEW.textPrimary,
    fontSize: 22,
    letterSpacing: -0.96,
    lineHeight: 32,
    fontFamily: 'Pretendard-SemiBold',
  },
  sectionSubtitle: {
    color: COLORS_NEW.border,
    fontSize: 16,
    letterSpacing: -0.56,
    fontFamily: 'Pretendard-Regular',
    marginTop: 4,
    marginBottom: 24,
  },
  weakList: {
    gap: 18,
  },
  weakItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  weakBody: {
    flex: 1,
    gap: 7.2,
  },
  weakHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weakNumber: {
    width: 24,
    height: 24,
    borderRadius: 11.7,
    backgroundColor: COLORS_NEW.point,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weakNumberText: {
    color: COLORS_NEW.background,
    fontSize: 12.6,
    letterSpacing: -0.504,
    lineHeight: 18.9,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
  },
  weakContent: {
    flex: 1,
    color: COLORS_NEW.textPrimary,
    fontSize: 14,
    letterSpacing: -0.648,
    lineHeight: 23.4,
    fontFamily: 'Pretendard-Regular',
  },
  weakProgressTrack: {
    marginTop: 4,
    height: 10,
    borderRadius: 6.3,
    backgroundColor: COLORS_NEW.lightGray,
    overflow: 'hidden',
  },
  weakProgressFill: {
    height: '100%',
    borderRadius: 6.3,
    backgroundColor: COLORS_NEW.point,
  },
  weakRate: {
    color: COLORS_NEW.point,
    fontSize: 18,
    letterSpacing: -0.576,
    lineHeight: 21.6,
    fontFamily: 'Pretendard-SemiBold',
    marginLeft: 8,
  },
});
