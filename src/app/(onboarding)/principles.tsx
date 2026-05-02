import { View, Text, StyleSheet } from 'react-native';

export default function OnboardingPrinciplesScreen() {
  return (
    <View style={styles.container}>
      <Text>Onboarding Principles</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
