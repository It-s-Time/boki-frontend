import { useEffect } from 'react';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { syncExchangeTrades } from '@/api/exchange';
import { tradeKeys } from '@/features/trade/hooks/useTrades';
import { COLORS } from '@/shared/constants/colors';
import { useApiStore } from '@/store/apiStore';

const SUCCESS_IMAGE = require('../../../assets/images/api-success-check.png');

export default function ApiSuccessScreen() {
  const setApiConnected = useApiStore((s) => s.setApiConnected);
  const queryClient = useQueryClient();

  useEffect(() => {
    setApiConnected(true);

    const syncTrades = async () => {
      try {
        const data = await syncExchangeTrades();
        if (data.isSuccess) {
          const syncedTrades = data.result?.trades ?? [];
          await queryClient.invalidateQueries({ queryKey: tradeKeys.all });

          if (syncedTrades.length > 0) {
            queryClient.setQueryData(tradeKeys.list(), syncedTrades);
          }
        }
      } catch {
        // The center refresh button can retry sync if the first attempt fails.
      }
    };

    void syncTrades();

    const timer = setTimeout(() => {
      router.replace('/(tabs)/mypage');
    }, 2000);

    return () => clearTimeout(timer);
  }, [queryClient, setApiConnected]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoSection}>
          <Image
            source={SUCCESS_IMAGE}
            style={styles.successImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>API 키 등록에 성공했어요!</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.box,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingBottom: 72,
  },
  successImage: {
    width: 180,
    height: 180,
  },
  title: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
    fontSize: 23,
    lineHeight: 32,
  },
});
