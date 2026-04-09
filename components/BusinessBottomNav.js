import { Calendar, Home, MessageCircle, UserCog } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BusinessBottomNav({ navigation, active }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('BusinessHome')}
      >
        <Home color={active === 'Home' ? '#FFD700' : '#fff'} size={26} />
        <Text style={[styles.navItem, active === 'Home' && styles.activeNavItem]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('BusinessCalendar')}
      >
        <Calendar color={active === 'Calendar' ? '#FFD700' : '#fff'} size={26} />
        <Text style={[styles.navItem, active === 'Calendar' && styles.activeNavItem]}>Calendar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('ChatScreen')}
      >
        <MessageCircle color={active === 'Chat' ? '#FFD700' : '#fff'} size={26} />
        <Text style={[styles.navItem, active === 'Chat' && styles.activeNavItem]}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('AccountScreen')}
      >
        <UserCog color={active === 'Account' ? '#FFD700' : '#fff'} size={26} />
        <Text style={[styles.navItem, active === 'Account' && styles.activeNavItem]}>Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0a2540',
    height: 70,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 8,
    zIndex: 100,
  },
  tab: {
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
  label: {
    // legacy, for compatibility
    color: '#fff',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
  activeLabel: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});
