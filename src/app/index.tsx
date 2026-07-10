import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { COLORS_NEW } from '@/shared/constants/colors';
import SymbolIntro from '@/shared/components/SymbolIntro';
import Symbol from '../../assets/symbol.svg';
import LogoText from '../../assets/logo2.svg';

const SYMBOL_SIZE = 60;
const LOGO_TEXT_WIDTH = 140;
const LOGO_TEXT_HEIGHT = 60;
const GAP = 24;
// intro 중엔 심볼이 화면 정중앙에 있다가, logoRow에 합류하면 그 슬롯(row 중심 기준 왼쪽)으로
// 밀려나므로 solo 위치 -> 슬롯 위치로 되돌아가는 만큼만 초기 translateX로 보정한다.
const SYMBOL_SLOT_OFFSET = (LOGO_TEXT_WIDTH + GAP) / 2;

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const loadAuth = useAuthStore((state) => state.loadAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  const slideX = useRef(new Animated.Value(SYMBOL_SLOT_OFFSET)).current;
  const logoTextOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadAuth().then(() => setIsReady(true));
  }, []);

  // 스플래시(인트로 + 전환 애니메이션)는 인증 체크 결과와 무관하게 항상 재생하고,
  // 애니메이션과 인증 체크가 둘 다 끝난 뒤에만 목적지로 이동한다.
  useEffect(() => {
    if (!animDone || !isReady) return;
    router.replace(accessToken ? '/(tabs)' : '/(auth)/signup');
  }, [animDone, isReady, accessToken]);

  useEffect(() => {
    if (!introDone) return;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(slideX, {
          toValue: 0,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoTextOpacity, {
          toValue: 1,
          duration: 550,
          delay: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // 완성된 심볼+로고2를 signup으로 넘어가기 전에 잠시 더 붙잡아 둔다.
      Animated.delay(800),
    ]).start(({ finished }) => {
      if (finished) setAnimDone(true);
    });
  }, [introDone]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.logoSection}>
        {!introDone ? (
          <SymbolIntro size={SYMBOL_SIZE} onFinish={() => setIntroDone(true)} />
        ) : (
          <View style={styles.logoRow}>
            <Animated.View style={{ transform: [{ translateX: slideX }] }}>
              <Symbol width={SYMBOL_SIZE} height={SYMBOL_SIZE} />
            </Animated.View>
            <Animated.View style={{ opacity: logoTextOpacity }}>
              <LogoText width={LOGO_TEXT_WIDTH} height={LOGO_TEXT_HEIGHT} />
            </Animated.View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
  },
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP,
  },
});
