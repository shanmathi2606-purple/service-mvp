import { signOut } from 'firebase/auth';
import { Button, Text, View } from 'react-native';
import { auth } from '../firebase';
export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Login');
  };

  
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ fontSize:24 }}>Home Screen</Text>
      <Button title="Logout" onPress={handleLogout} />

      <Button title="Book Appointment" onPress={() => navigation.navigate("Booking")} />
      <Button title="View My Appointments" onPress={() => navigation.navigate("MyBookings")} />


    </View>
  );
}


