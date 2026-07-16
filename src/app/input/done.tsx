import { View, StyleSheet, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS_NEW } from '@/shared/constants/colors';
import PrimaryButton from '@/shared/components/PrimaryButton';

const finishImage = require('../../../assets/finish.png');

export default function InputDoneScreen() {
  const { tradeId, coinName, symbol, amount, tradeType, price, time } =
    useLocalSearchParams<{
      tradeId: string;
      coinName: string;
      symbol: string;
      amount: string;
      tradeType: string;
      price: string;
      time: string;
    }>();

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const handleStartReview = () => {
    router.replace({
      pathname: '/review/select-principle-set',
      params: {
        tradeId,
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Image source={finishImage} style={{ width: 184, height: 184 }} />

        <Text style={styles.message}>거래 내역 추가 완료했어요</Text>
      </View>

      <View style={styles.buttonRow}>
        <PrimaryButton
          label="홈으로 가기"
          onPress={handleGoHome}
          style={styles.button}
        />
        <PrimaryButton
          label="바로 복기 시작"
          onPress={handleStartReview}
          style={styles.button}
        />
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  message: {
    fontSize: 22,
    letterSpacing: -0.88,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Medium',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 16,
  },
  button: {
    flex: 1,
  },
});
