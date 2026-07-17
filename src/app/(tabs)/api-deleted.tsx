import { useCallback, useEffect } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { BackHandler, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS_NEW } from '@/shared/constants/colors';
import { useApiStore } from '@/store/apiStore';

const SUCCESS_IMAGE = require('../../../assets/images/api-success-check.png');

export default function ApiDeletedScreen() {
  const setApiConnected = useApiStore((s) => s.setApiConnected);

  const goToApiManagement = useCallback(() => {
    router.replace('/(tabs)/mypage');
  }, []);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          goToApiManagement();
          return true;
        },
      );

      return () => subscription.remove();
    }, [goToApiManagement]),
  );

  useEffect(() => {
    setApiConnected(false);

    const timer = setTimeout(goToApiManagement, 2000);

    return () => clearTimeout(timer);
  }, [setApiConnected, goToApiManagement]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Image
          source={SUCCESS_IMAGE}
          style={styles.successImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>등록한 API를 삭제했어요</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
    paddingBottom: 110,
  },
  successImage: {
    width: 180,
    height: 180,
  },
  title: {
    color: COLORS_NEW.textSecondary,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
    fontSize: 23,
    lineHeight: 32,
  },
});
