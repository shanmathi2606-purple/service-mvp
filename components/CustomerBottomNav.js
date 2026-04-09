import { MessageCircle } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomerBottomNav = ({ navigation, active }) => (
  <View style={styles.bottomNav}>
    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
      <Image source={require('../assets/images/home.png')} style={styles.navIcon} />
      <Text style={[styles.navItem, active === 'Home' && styles.activeNavItem]}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MyBookings')}>
      <Image source={require('../assets/images/calendar.png')} style={styles.navIcon} />
      <Text style={[styles.navItem, active === 'MyBookings' && styles.activeNavItem]}>My Bookings</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Inbox')}>
      <MessageCircle size={20} color={active === 'Inbox' ? '#FFD700' : '#fff'} />
      <Text style={[styles.navItem, active === 'Inbox' && styles.activeNavItem]}>Chat</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
      <Image source={require('../assets/images/user.png')} style={styles.navIcon} />
      <Text style={[styles.navItem, active === 'Profile' && styles.activeNavItem]}>Profile</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0a2540',
    height: 70,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  navItem: {
    color: '#fff',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
  activeNavItem: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  navIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});

export default CustomerBottomNav;
