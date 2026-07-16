import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import SymbolSpinner from './SymbolSpinner';

const SPINNER_SIZE = 60;

interface Props {
  message?: string;
}

export default function LoadingScreen({ message }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.loadingBlock}>
          <SymbolSpinner size={SPINNER_SIZE} />
        </View>
        {!!message && <Text style={styles.message}>{message}</Text>}
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
  message: {
    marginTop: 40,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    letterSpacing: -0.8,
    lineHeight: 28,
    textAlign: 'center',
  },
});
