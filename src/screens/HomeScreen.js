import { Button, Text, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ fontSize:24 }}>Home Screen</Text>
      <Button title="Book Service" onPress={() => navigation.navigate('Book')} />
      <Button title="My Bookings" onPress={() => navigation.navigate('MyBookings')} />
      <Button title="Business Bookings" onPress={() => navigation.navigate('BusinessBookings')} />
    </View>
  );
}
