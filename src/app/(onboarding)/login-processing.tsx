import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function LoginProcessingScreen() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.replace('/api-key');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.text}>로그인{'\n'}처리 중입니다...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  text: {
    position: 'absolute',
    top: 400,
    alignSelf: 'center',
    width: 275,
    height: 257,
    color: '#000000',
    fontFamily: 'Pretendard-Bold',
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 52,
    textAlign: 'center',
  },
});
