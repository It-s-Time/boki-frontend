import { COLORS } from '@/shared/constants/colors';
import PrincipleSetCard from '@/features/review/components/PrincipleSetCard';
import { PrincipleSet } from '@/features/review/types';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const MOCK_PRINCIPLE_SETS: PrincipleSet[] = [
  {
    id: '1',
    name: '나의 안정형 전략',
    description: '장기 보유 중심의 안정적인 투자 전략',
    createdAt: '2026.03.15',
    buyCount: 3,
    sellCount: 3,
  },
  {
    id: '2',
    name: '나의 안정형 전략',
    description: '장기 보유 중심의 안정적인 투자 전략',
    createdAt: '2026.03.15',
    buyCount: 3,
    sellCount: 3,
  },
  {
    id: '3',
    name: '나의 안정형 전략',
    description: '장기 보유 중심의 안정적인 투자 전략',
    createdAt: '2026.03.15',
    buyCount: 3,
    sellCount: 3,
  },
];

export default function SelectPrincipleSetScreen() {
  const router = useRouter();
  const { tradeId } = useLocalSearchParams<{ tradeId: string }>();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleStart = () => {
    if (!selectedId) return;
    // TODO: 복기 시작 화면으로 이동
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.title}>복기할 매매원칙 세트 선택</Text>
      </View>

      <Text style={styles.subtitle}>어떤 원칙으로 복기할 지 선택해보세요.</Text>

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {MOCK_PRINCIPLE_SETS.map((set) => (
          <PrincipleSetCard
            key={set.id}
            set={set}
            selected={selectedId === set.id}
            onPress={() => setSelectedId(set.id)}
          />
        ))}
      </ScrollView>

      <Pressable
        style={[styles.startButton, selectedId && styles.startButtonActive]}
        onPress={handleStart}
        disabled={!selectedId}
      >
        <Text
          style={[
            styles.startButtonText,
            selectedId && styles.startButtonTextActive,
          ]}
        >
          복기 시작하기
        </Text>
      </Pressable>
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
    marginBottom: 6,
  },

  backButton: {
    marginLeft: 12,
    marginRight: 14,
    padding: 4,
  },

  title: {
    fontSize: 24,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 24,
    marginLeft: 60,
  },

  list: {
    flex: 1,
  },

  startButton: {
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.iconBox,
    marginTop: 8,
  },

  startButtonActive: {
    backgroundColor: COLORS.textSecondary,
    color: '#FFFFFF',
  },

  startButtonText: {
    fontSize: 18,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  startButtonTextActive: {
    color: '#FFFFFF',
  },
});
