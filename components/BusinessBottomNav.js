import { Calendar, Home, MessageCircle, UserCog } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BusinessBottomNav({ navigation, active }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('BusinessHome')}
      >
        <Home color={active === 'Home' ? '#0a2540' : '#ffffff'} size={26} />
        <Text style={[styles.label, active === 'Home' && styles.activeLabel]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('BusinessCalendar')}
      >
        <Calendar color={active === 'Calendar' ? '#0a2540' : '#ffffff'} size={26} />
        <Text style={[styles.label, active === 'Calendar' && styles.activeLabel]}>Calendar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('ChatScreen')}
      >
        <MessageCircle color={active === 'Chat' ? '#0a2540' : '#ffffff'} size={26} />
        <Text style={[styles.label, active === 'Chat' && styles.activeLabel]}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('AccountScreen')}
      >
        <UserCog color={active === 'Account' ? '#0a2540' : '#ffffff'} size={26} />
        <Text style={[styles.label, active === 'Account' && styles.activeLabel]}>Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#34495E',
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
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 2,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});
