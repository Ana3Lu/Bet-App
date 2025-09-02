import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: "#f0f0f0"
    },
    text: {
      fontSize: 30
    }
})

//image
//text input 
//button-> TouchableOpacity

export default function HomeScreen() {
  return <View
  style={styles.container}>

    <Text>
      Hola mundo
    </Text>
  </View>
}