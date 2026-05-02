import { View, Text, StyleSheet } from 'react-native';

export default function PrinciplesScreen() {
  return (
    <View style={styles.container}>
      <Text>Principles</Text>
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
