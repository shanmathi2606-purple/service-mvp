// src/navigation/RootNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthLoadingScreen from '../screens/Authentication/AuthLoadingScreen';
import EmailVerifiedScreen from '../screens/Authentication/EmailVerifiedScreen';
import LoginScreen from '../screens/Authentication/LoginScreen';
import SignupScreen from '../screens/Authentication/SignupScreen';
import SplashScreen from '../screens/Authentication/SplashScreen';
import AccountScreen from '../screens/Business/AccountScreen';
import BusinessCalendarScreen from '../screens/Business/BusinessCalendarScreen';
import BusinessHomeScreen from '../screens/Business/BusinessHomeScreen';
import ChatScreen from '../screens/Business/ChatScreen';
import BeautyScreen from '../screens/Customer/BeautyScreen';
import BookingScreen from '../screens/Customer/BookingScreen';
import BusinessProfileScreen from '../screens/Customer/BusinessProfileScreen';
import FavouritesScreen from '../screens/Customer/FavouritesScreen';
import FoodDiningScreen from '../screens/Customer/FoodDiningScreen';
import FreelanceScreen from '../screens/Customer/FreelanceScreen';
import HomeScreen from '../screens/Customer/HomeScreen';
import MyBookingsScreen from '../screens/Customer/MyBookingsScreen';
import Profile from '../screens/Customer/Profile';
import WellnessScreen from '../screens/Customer/WellnessScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        animation: 'none', // disables all transitions
      }}
    >
      <Stack.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{ headerShown: false }}
      />
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
        name="EmailVerified"
        component={EmailVerifiedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BusinessHome"
        component={BusinessHomeScreen}
        options={{ title: 'Business Home', headerShown: false }}
      />
      <Stack.Screen
        name="BusinessCalendar"
        component={BusinessCalendarScreen}
        options={{ title: 'Business Calendar', headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ title: 'Chat', headerShown: false }}
      />
      <Stack.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{ title: 'Account', headerShown: false }}
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
      <Stack.Screen
        name="BusinessProfile"
        component={BusinessProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Inbox"
        component={require('../screens/Customer/InboxScreen').default}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
