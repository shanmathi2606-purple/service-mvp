import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

// Navy shade for business top bar
const NAVY = '#192841';

export default function BusinessTopBar({ navigation, title = '', onBellPress }) {
  return (
    <View style={styles.headerBackground}>
      <View style={styles.topBarRowExpandedShifted}>
        <TouchableOpacity style={styles.topBarButton} onPress={() => navigation.replace('Login')}>
          <View style={styles.topBarIconCircle}>
            <Feather name="log-out" size={22} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.topBarWelcomeText}>{title}</Text>
        <TouchableOpacity style={styles.topBarButton} onPress={onBellPress || (() => {})}>
          <View style={styles.topBarIconCircle}>
            <Feather name="bell" size={22} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBackground: { backgroundColor: NAVY, paddingVertical: 13 },
  topBarRowExpanded: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  topBarRowExpandedShifted: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 8 },
  topBarButton: { padding: 8 },
  topBarIconCircle: { backgroundColor: '#22325a', borderRadius: 20, padding: 6 },
  topBarWelcomeText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});
