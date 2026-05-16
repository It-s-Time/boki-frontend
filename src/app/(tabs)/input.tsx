import { COLORS } from '@/shared/constants/colors';
import {
  AntDesign,
  Entypo,
  Feather,
} from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Screen = 'list' | 'detail';

const activePrinciples = [
  '기술적 분석 지표 3개 이상 확인',
  '하루 최대 2회 거래',
  '포트폴리오 10% 이상 투자 금지',
];

const packagePrinciples = [
  '손실이 투자금의 3% 도달 시 추가 매수',
  '수익이 5% 이상 발생하면 절반을 익절',
  '하루 최대 2회까지만 매수',
  '총 자산 10%를 초과하여 투자 금지',
];

const packages = [
  { title: '안정형', desc: '보수적이고 안정적인 투자 전략' },
  { title: '단기 투자형', desc: '빠른 매매로 수익 실현' },
  { title: '성장형', desc: '장기 관점의 성장 전략' },
];

function TradePill({
  type,
  count,
}: {
  type: 'buy' | 'sell';
  count: number;
}) {
  const isBuy = type === 'buy';

  return (
    <View style={styles.tradePill}>
      <View
        style={[
          styles.tradeIconBox,
          { backgroundColor: isBuy ? COLORS.buy : COLORS.sell },
        ]}
      >
        <Feather
          name={isBuy ? 'arrow-up-right' : 'arrow-down-right'}
          size={18}
          color={isBuy ? COLORS.buyText : COLORS.sellText}
        />
      </View>
      <Text style={styles.tradePillText}>
        {isBuy ? '매수' : '매도'} {count}개
      </Text>
    </View>
  );
}

function StrategyCard({
  title,
  date,
  onPress,
}: {
  title: string;
  date: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.strategyCard} onPress={onPress}>
      <View style={styles.strategyHeader}>
        <View>
          <Text style={styles.strategyTitle}>{title}</Text>
          <Text style={styles.strategyDate}>{date} 생성</Text>
        </View>
        <Entypo name="chevron-thin-right" size={22} color={COLORS.textSecondary} />
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.tradeRow}>
        <TradePill type="buy" count={3} />
        <TradePill type="sell" count={3} />
      </View>
    </Pressable>
  );
}

function RuleTabs() {
  return (
    <View style={styles.ruleTabs}>
      <View style={styles.ruleTabActive}>
        <Feather name="trending-up" size={16} color={COLORS.textPrimary} />
        <Text style={styles.ruleTabActiveText}>매수 원칙</Text>
      </View>
      <View style={styles.ruleTab}>
        <Feather name="trending-down" size={16} color={COLORS.textPrimary} />
        <Text style={styles.ruleTabText}>매도 원칙</Text>
      </View>
    </View>
  );
}

function ActivePrinciples({
  added,
  onAddPress,
}: {
  added: string[];
  onAddPress: () => void;
}) {
  const rows = [...activePrinciples, ...added];

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>활성화된 원칙 ({rows.length})</Text>
        <View style={styles.sectionActions}>
          <Feather name="edit-2" size={20} color="#8B8F98" />
          <Feather name="trash-2" size={20} color="#8B8F98" />
        </View>
      </View>

      <View style={styles.activeList}>
        {rows.map((item, index) => (
          <View
            key={`${item}-${index}`}
            style={[
              styles.activeRule,
              index >= activePrinciples.length && styles.addedRule,
            ]}
          >
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.activeRuleText}>{item}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.addRuleButton} onPress={onAddPress}>
        <AntDesign name="plus" size={22} color={COLORS.textSecondary} />
        <Text style={styles.addRuleText}>새 매수 원칙 추가</Text>
      </Pressable>
    </View>
  );
}

function PackageCard({
  title,
  desc,
  expanded,
  checked,
  onOpen,
  onToggle,
  onAdd,
}: {
  title: string;
  desc: string;
  expanded: boolean;
  checked: boolean[];
  onOpen: () => void;
  onToggle: (index: number) => void;
  onAdd: () => void;
}) {
  const selectedCount = checked.filter(Boolean).length;

  return (
    <View style={styles.packageCard}>
      <Pressable style={styles.packageSummary} onPress={onOpen}>
        <View style={styles.packageThumb} />
        <View style={styles.packageTextBox}>
          <Text style={styles.packageTitle}>{title}</Text>
          <Text style={styles.packageDesc}>{desc}</Text>
        </View>
        <Entypo
          name={expanded ? 'chevron-thin-down' : 'chevron-thin-right'}
          size={20}
          color={COLORS.textSecondary}
        />
      </Pressable>

      {expanded && (
        <View style={styles.packageDetail}>
          <Text style={styles.includedTitle}>포함된 원칙</Text>
          <View style={styles.checkboxList}>
            {packagePrinciples.map((item, index) => (
              <Pressable
                key={item}
                style={styles.checkboxRow}
                onPress={() => onToggle(index)}
              >
                <View
                  style={[
                    styles.checkbox,
                    checked[index] && styles.checkboxChecked,
                  ]}
                >
                  {checked[index] && (
                    <Feather name="check" size={10} color={COLORS.box} />
                  )}
                </View>
                <Text style={styles.checkboxText}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={styles.addSelectedButton}
            onPress={onAdd}
            disabled={selectedCount === 0}
          >
            <Text style={styles.addSelectedText}>
              선택한 원칙 추가하기 ({selectedCount}개)
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function InputScreen() {
  const [screen, setScreen] = useState<Screen>('list');
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [checked, setChecked] = useState([true, false, false, false]);
  const [addedPrinciples, setAddedPrinciples] = useState<string[]>([]);
  const [addRuleVisible, setAddRuleVisible] = useState(false);
  const [ruleText, setRuleText] = useState('');
  const [pendingRules, setPendingRules] = useState<string[]>([]);

  const selectedPrinciples = packagePrinciples.filter((_, index) => checked[index]);

  const addSelectedPrinciples = () => {
    setAddedPrinciples((current) => {
      const next = [...current];
      selectedPrinciples.forEach((item) => {
        if (!next.includes(item)) next.push(item);
      });
      return next;
    });
    setExpandedPackage(null);
  };

  const addPendingRule = () => {
    const nextRule = ruleText.trim();
    if (!nextRule) return;

    setPendingRules((current) => [...current, nextRule]);
    setRuleText('');
  };

  const removePendingRule = (index: number) => {
    setPendingRules((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const closeAddRule = () => {
    setAddRuleVisible(false);
    setRuleText('');
    setPendingRules([]);
  };

  const applyPendingRules = () => {
    if (pendingRules.length === 0) return;

    setAddedPrinciples((current) => [...current, ...pendingRules]);
    closeAddRule();
  };

  if (screen === 'list') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          <View style={styles.listTop}>
            <Text style={styles.pageTitle}>매매원칙 세트 관리</Text>
            <Text style={styles.pageDesc}>나만의 투자 전략을 관리하세요</Text>
          </View>

          <View style={styles.fullDivider} />

          <Text style={styles.listSectionTitle}>내 매매원칙 세트 (2)</Text>

          <StrategyCard
            title="나의 안정형 전략"
            date="2026.03.15"
            onPress={() => setScreen('detail')}
          />
          <StrategyCard
            title="단기 스캘핑 원칙"
            date="2026.03.20"
            onPress={() => setScreen('detail')}
          />

          <Pressable style={styles.newSetButton}>
            <AntDesign name="plus" size={22} color={COLORS.textSecondary} />
            <Text style={styles.newSetText}>새 매매원칙 세트 추가</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.detailContent}
      >
        <View style={styles.detailHeader}>
          <Pressable onPress={() => setScreen('list')}>
            <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
          </Pressable>
          <View style={styles.detailTitleBox}>
            <Text style={styles.detailTitle}>나의 안정형 전략</Text>
            <Text style={styles.detailDate}>2026.03.15 생성</Text>
          </View>
          <View style={styles.detailActions}>
            <Feather name="edit-2" size={22} color={COLORS.textPrimary} />
            <Feather name="save" size={22} color={COLORS.textPrimary} />
          </View>
        </View>

        <View style={styles.fullDivider} />
        <RuleTabs />
        <ActivePrinciples
          added={addedPrinciples}
          onAddPress={() => setAddRuleVisible(true)}
        />

        <Text style={styles.packageSectionTitle}>추천 매매 원칙 패키지</Text>
        {packages.map((item) => (
          <PackageCard
            key={item.title}
            title={item.title}
            desc={item.desc}
            expanded={expandedPackage === item.title}
            checked={checked}
            onOpen={() =>
              setExpandedPackage((current) =>
                current === item.title ? null : item.title,
              )
            }
            onToggle={(index) =>
              setChecked((current) =>
                current.map((value, currentIndex) =>
                  currentIndex === index ? !value : value,
                ),
              )
            }
            onAdd={addSelectedPrinciples}
          />
        ))}

        <Text style={styles.tipText}>
          Tip: 매수와 매도 원칙을 각각 최소 3개 이상 설정을 권장합니다. 최대한
          구체적으로 본인 투자 성향에 맞게 자유롭게 구성해주세요!
        </Text>
      </ScrollView>

      <Modal
        visible={addRuleVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAddRule}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.addRuleModal}>
            <Text style={styles.modalTitle}>매수 원칙 추가</Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.ruleInput}
                value={ruleText}
                onChangeText={setRuleText}
                placeholder="원칙을 입력하세요"
                placeholderTextColor={COLORS.textSecondary}
                returnKeyType="done"
                onSubmitEditing={addPendingRule}
              />
              <Pressable style={styles.yellowPlusButton} onPress={addPendingRule}>
                <AntDesign name="plus" size={24} color={COLORS.textPrimary} />
              </Pressable>
            </View>

            <Text style={styles.pendingTitle}>
              추가할 원칙 ({pendingRules.length}개)
            </Text>

            <View style={styles.pendingList}>
              {pendingRules.map((item, index) => (
                <View key={`${item}-${index}`} style={styles.pendingRule}>
                  <View style={styles.ruleNumber}>
                    <Text style={styles.ruleNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.pendingRuleText}>{item}</Text>
                  <Pressable onPress={() => removePendingRule(index)}>
                    <Feather name="x" size={22} color={COLORS.textSecondary} />
                  </Pressable>
                </View>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={closeAddRule}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.confirmButton,
                  pendingRules.length === 0 && styles.confirmButtonDisabled,
                ]}
                onPress={applyPendingRules}
                disabled={pendingRules.length === 0}
              >
                <Text style={styles.confirmButtonText}>
                  추가 ({pendingRules.length})
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 24,
  },
  listTop: {
    paddingHorizontal: 28,
    paddingTop: 38,
    paddingBottom: 24,
  },
  pageTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 24,
    lineHeight: 34,
  },
  pageDesc: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    marginTop: 8,
  },
  fullDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  listSectionTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    marginTop: 18,
    marginBottom: 18,
    marginHorizontal: 28,
  },
  strategyCard: {
    backgroundColor: COLORS.box,
    borderRadius: 8,
    marginHorizontal: 28,
    marginBottom: 10,
    padding: 18,
  },
  strategyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  strategyTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
  },
  strategyDate: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    marginTop: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  tradeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  tradePill: {
    flex: 1,
    height: 38,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 8,
  },
  tradeIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tradePillText: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
  },
  newSetButton: {
    height: 54,
    marginHorizontal: 28,
    marginTop: 4,
    borderRadius: 8,
    backgroundColor: COLORS.iconBox,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  newSetText: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
  },
  detailContent: {
    paddingBottom: 28,
  },
  detailHeader: {
    minHeight: 132,
    paddingHorizontal: 28,
    paddingTop: 36,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailTitleBox: {
    flex: 1,
    marginLeft: 16,
  },
  detailTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 24,
    lineHeight: 31,
  },
  detailDate: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    marginTop: 12,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 20,
  },
  ruleTabs: {
    marginHorizontal: 28,
    marginTop: 24,
    padding: 8,
    height: 76,
    borderRadius: 8,
    backgroundColor: COLORS.button,
    flexDirection: 'row',
    gap: 8,
  },
  ruleTabActive: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: COLORS.box,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ruleTab: {
    flex: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ruleTabActiveText: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 15,
  },
  ruleTabText: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
  },
  section: {
    marginTop: 26,
    marginHorizontal: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
  },
  sectionActions: {
    flexDirection: 'row',
    gap: 18,
  },
  activeList: {
    gap: 8,
  },
  activeRule: {
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
  },
  addedRule: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryLight,
  },
  ruleNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleNumberText: {
    color: COLORS.box,
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
  },
  activeRuleText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
  },
  addRuleButton: {
    height: 54,
    borderRadius: 8,
    backgroundColor: COLORS.iconBox,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  addRuleText: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
  },
  packageSectionTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    marginHorizontal: 28,
    marginTop: 26,
    marginBottom: 18,
  },
  packageCard: {
    backgroundColor: COLORS.box,
    borderRadius: 8,
    marginHorizontal: 28,
    marginBottom: 10,
    overflow: 'hidden',
  },
  packageSummary: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 12,
  },
  packageThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  packageTextBox: {
    flex: 1,
  },
  packageTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 17,
  },
  packageDesc: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    marginTop: 8,
  },
  packageDetail: {
    backgroundColor: COLORS.background,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    padding: 18,
  },
  includedTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    marginBottom: 14,
  },
  checkboxList: {
    gap: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.textPrimary,
    borderColor: COLORS.textPrimary,
  },
  checkboxText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
  },
  addSelectedButton: {
    height: 46,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  addSelectedText: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 15,
  },
  tipText: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 22,
    marginHorizontal: 28,
    marginTop: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  addRuleModal: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: COLORS.box,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 18,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ruleInput: {
    flex: 1,
    height: 58,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 18,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
  },
  yellowPlusButton: {
    width: 58,
    height: 58,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingTitle: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    marginTop: 24,
    marginBottom: 12,
  },
  pendingList: {
    gap: 8,
    minHeight: 0,
  },
  pendingRule: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
  },
  pendingRuleText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 18,
  },
  cancelButton: {
    flex: 1,
    height: 58,
    borderRadius: 8,
    backgroundColor: COLORS.iconBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
  },
  confirmButton: {
    flex: 1,
    height: 58,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.primaryLight,
  },
  confirmButtonText: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
  },
});
