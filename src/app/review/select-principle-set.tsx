import { COLORS_NEW } from '@/shared/constants/colors';
import PrincipleSetCard from '@/features/review/components/PrincipleSetCard';
import BackHeader from '@/shared/components/BackHeader';
import PrimaryButton from '@/shared/components/PrimaryButton';
import { PRINCIPLE_SETS } from '@/features/review/data';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SelectPrincipleSetScreen() {
  const router = useRouter();
  const { tradeId, coinName, symbol, amount, tradeType, time, price } =
    useLocalSearchParams<{
      tradeId: string;
      coinName: string;
      symbol: string;
      amount: string;
      tradeType: string;
      time: string;
      price: string;
    }>();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleStart = () => {
    if (!selectedId) return;
    router.push({
      pathname: '/review/session',
      params: {
        tradeId,
        principleSetId: selectedId,
        coinName,
        symbol,
        amount,
        tradeType,
        time,
        price,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BackHeader title="매매원칙 선택" onBack={() => router.back()} />

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 24,
          paddingTop: 24,
        }}
      >
        {PRINCIPLE_SETS.map((set) => (
          <PrincipleSetCard
            key={set.id}
            set={set}
            selected={selectedId === set.id}
            dimmed={selectedId !== null && selectedId !== set.id}
            onPress={() => setSelectedId(set.id)}
          />
        ))}
      </ScrollView>

      <Text style={styles.helperText}>
        {selectedId
          ? '선택한 원칙을 바탕으로 복기를 시작합니다.'
          : '원칙 하나를 선택해주세요.'}
      </Text>

      <PrimaryButton
        label={selectedId ? '복기 시작하기' : '다음'}
        onPress={handleStart}
        disabled={!selectedId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },

  list: {
    flex: 1,
    marginHorizontal: -24,
  },

  helperText: {
    fontSize: 16,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
});
