// src/navigation/RootNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import BeautyScreen from '../screens/BeautyScreen';
import BookingScreen from '../screens/BookingScreen';
import BusinessBookingsScreen from '../screens/BusinessBookingsScreen';
import FoodDiningScreen from '../screens/FoodDiningScreen';
import FreelanceScreen from '../screens/FreelanceScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import Profile from '../screens/Profile';
import SignupScreen from '../screens/SignupScreen';
import WellnessScreen from '../screens/WellnessScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthLoading"
        component={AuthLoadingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ title: 'Create account' }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ title: 'Book Appointment' }}
      />
      <Stack.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ title: 'My Bookings' }}
      />
      <Stack.Screen
        name="BusinessBookings"
        component={BusinessBookingsScreen}
        options={{ title: 'All Bookings' }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Beauty"
        component={BeautyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Wellness"
        component={WellnessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FoodDining"
        component={FoodDiningScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Freelance"
        component={FreelanceScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
