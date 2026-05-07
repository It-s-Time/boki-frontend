import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function DesignPreviewScreen() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.replace('/api-success');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.loadingBlock}>
          <ActivityIndicator size={86} color="#000000" />
          <Text style={styles.loadingText}>로딩중</Text>
        </View>

        <Text style={styles.message}>API가 연동되고 있어요!</Text>
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
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingBlock: {
    marginTop: 390,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 36,
    color: '#A6A6A6',
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  message: {
    marginTop: 88,
    width: 269,
    height: 28,
    color: '#000000',
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
    textAlign: 'center',
  },
});
