import { Button, Text, View } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ fontSize:24 }}>Login Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
