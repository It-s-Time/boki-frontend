import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const GRAY = '#D9D9D9';

export default function ApiSuccessScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>
          업비트 API 연동이{'\n'}성공적으로 마무리되었습니다!
        </Text>

        <View style={styles.logoParent}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>logo</Text>
          </View>
        </View>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>매매원칙 설정하기</Text>
        </Pressable>
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
  title: {
    alignSelf: 'flex-start',
    marginTop: 99,
    marginLeft: 30,
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 26,
    fontWeight: '400',
    lineHeight: 34,
  },
  logoParent: {
    width: '100%',
    height: 200,
    marginTop: 138,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: GRAY,
  },
  logoText: {
    color: '#000000',
    fontFamily: 'Pretendard-Bold',
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 54,
  },
  button: {
    width: 215,
    marginTop: 121,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 7,
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'left',
  },
});
