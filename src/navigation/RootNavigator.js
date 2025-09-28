import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookingScreen from '../screens/BookingScreen';
import BusinessBookingsScreen from '../screens/BusinessBookingsScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import SignupScreen from '../screens/SignupScreen';
console.log('MyBookingsScreen is', MyBookingsScreen);


const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown:false }}/>
      <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Create account' }}/>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Book" component={BookingScreen} options={{ title: 'Book Service' }}/>
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'My Bookings' }}/>
      <Stack.Screen name="BusinessBookings" component={BusinessBookingsScreen} options={{ title: 'All Bookings' }}/>
    </Stack.Navigator>
  );
}
