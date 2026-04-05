import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BusinessBottomNav from '../../../components/BusinessBottomNav';
import BusinessTopBar from '../../../components/BusinessTopBar';
import { auth, db } from '../../firebase';

export default function BusinessHomeScreen({ navigation }) {
  const [tab, setTab] = useState('Ongoing');
  const [showHistory, setShowHistory] = useState(false);
  // Dashboard state
  const [bookings, setBookings] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [reminders, setReminders] = useState([]);
  const [totalBookingsThisWeek, setTotalBookingsThisWeek] = useState(0);
  const [totalRevenueThisWeek, setTotalRevenueThisWeek] = useState(0);
  const [weekRange, setWeekRange] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      // Fetch bookings for this business
      const q = query(collection(db, 'bookings'), where('businessId', '==', user.uid));
      const snap = await getDocs(q);
      let revenue = 0;
      let count = 0;
      let todayReminders = [];
      const today = new Date().toISOString().slice(0, 10);
      snap.forEach(doc => {
        const data = doc.data();
        count++;
        if (data.price) revenue += Number(data.price);
        // Bookings for today
        if (data.date === today) todayReminders.push(data);
      });
      setBookings(snap.docs.map(d => d.data()));
      setTotalRevenue(revenue);
      setTotalBookings(count);
      setReminders(todayReminders);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!showHistory) return;
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, 'bookings'), where('businessId', '==', user.uid));
      const snap = await getDocs(q);
      const today = new Date().toISOString().slice(0, 10);
      const all = snap.docs.map(d => d.data());
      // Sort: upcoming first, then past
      all.sort((a, b) => (a.date > b.date ? -1 : 1));
      setHistory(all);
    };
    fetchHistory();
  }, [showHistory]);

  useEffect(() => {
    const today = new Date();
    const weekStart = getMonday(today);
    const weekEnd = getSunday(today);
    setWeekRange(`${formatShort(weekStart)} - ${formatShort(weekEnd)}`);
  }, []);

  useEffect(() => {
    const today = new Date();
    const weekStart = getMonday(today);
    const weekEnd = getSunday(today);
    let weekBookings = 0;
    let weekRevenue = 0;
    bookings.forEach(b => {
      if (b.date) {
        // Accepts 'YYYY-MM-DD' or 'YYYY/MM/DD'
        const parts = b.date.split(/[-\/]/);
        if (parts.length === 3) {
          const bookingDate = new Date(parts[0], parts[1] - 1, parts[2]);
          if (bookingDate >= weekStart && bookingDate <= weekEnd) {
            weekBookings++;
            if (b.price) weekRevenue += Number(b.price);
          }
        }
      }
    });
    setTotalBookingsThisWeek(weekBookings);
    setTotalRevenueThisWeek(weekRevenue);
  }, [bookings]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F5EF' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: 0 }}>
        <View style={styles.container}>
          {/* Top Header Bar */}
          <BusinessTopBar navigation={navigation} title="Business Home" />
          {/* Recent Bookings Section */}
          <View style={[dashboardStyles.section, { marginTop: 8, backgroundColor: '#2a3656' }]}> 
            <Text style={dashboardStyles.sectionTitle}>Recent Bookings</Text>
            {bookings.length === 0 ? (
              <Text style={{ color: '#b2becd' }}>No bookings yet.</Text>
            ) : (
              bookings.slice(0, 5).map((b, i) => (
                <View key={i} style={{ marginBottom: 10, backgroundColor: '#223', borderRadius: 8, padding: 10 }}>
                  <Text style={{ color: '#fff', fontWeight: '600' }}>{b.customerName || b.customerId || 'Customer'} - {b.time}</Text>
                  <Text style={{ color: '#b2becd', fontSize: 13 }}>{b.service || 'Service'} | {b.date}</Text>
                  {b.note ? <Text style={{ color: '#b2becd', fontSize: 12 }}>Note: {b.note}</Text> : null}
                </View>
              ))
            )}
          </View>
          {/* Dashboard Section */}
          <View style={[dashboardStyles.section, { backgroundColor: '#2a3656', marginTop: 8 }]}> 
            <Text style={dashboardStyles.sectionTitle}>Dashboard</Text>
            <Text style={{ color: '#b2becd', fontSize: 14, marginBottom: 8 }}>This week: {weekRange}</Text>
            <View style={dashboardStyles.statRow}>
              <Text style={dashboardStyles.statLabel}>Total Bookings (This Week)</Text>
              <Text style={dashboardStyles.statValue}>{totalBookingsThisWeek}</Text>
            </View>
            <View style={dashboardStyles.statRow}>
              <Text style={dashboardStyles.statLabel}>Total Revenue (This Week)</Text>
              <Text style={dashboardStyles.statValue}>${totalRevenueThisWeek}</Text>
            </View>
            <View style={dashboardStyles.statRow}>
              <Text style={dashboardStyles.statLabel}>Total Revenue (All Time)</Text>
              <Text style={dashboardStyles.statValue}>${totalRevenue}</Text>
            </View>
            <View style={dashboardStyles.statRow}>
              <Text style={dashboardStyles.statLabel}>Total Bookings</Text>
              <Text style={dashboardStyles.statValue}>{totalBookings}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <BusinessBottomNav navigation={navigation} active="Home" />
    </View>
  );
}

// Action Button Component
function ActionButton({ label }) {
  return (
    <TouchableOpacity style={styles.actionButton}>
      <Text style={styles.actionButtonIcon}>＋</Text>
      <Text style={styles.actionButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// Bottom Nav Icon Component
function NavIcon({ label, active, badge }) {
  return (
    <View style={styles.navIcon}>
      <View style={[styles.navCircle, active && styles.navCircleActive]} />
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F5EF' },
  // Top bar styles moved to reusable BusinessTopBar component
  headerTop: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'center'
  },
  headerCard: {
    backgroundColor: '#6F4EF2',
    borderRadius: 24,
    margin: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  greeting: { color: '#fff', fontSize: 16 },
  profileName: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  salesLabel: { color: '#e0d9fc', marginTop: 8 },
  salesAmount: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginVertical: 6 },
  rating: { color: '#e0d9fc', marginBottom: 10 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  actionButton: { alignItems: 'center', flex: 1 },
  actionButtonIcon: { fontSize: 28, color: '#fff', marginBottom: 2 },
  actionButtonLabel: { color: '#fff', fontSize: 12 },
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#EFEFEF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tabButton: { flex: 1, padding: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff' },
  tabText: { color: '#888', fontWeight: '600' },
  tabTextActive: { color: '#6F4EF2', fontWeight: 'bold' },
  scroll: { flex: 1, marginTop: 6 },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    margin: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  bookingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  bookingAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  bookingName: { fontWeight: 'bold', fontSize: 16 },
  bookingRole: { color: '#888', fontSize: 12 },
  nowBadge: {
    backgroundColor: '#F44',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden'
  },
  bookingInfo: { marginVertical: 8 },
  bookingLabel: { color: '#aaa', fontSize: 12 },
  bookingValue: { fontSize: 14, marginBottom: 2 },
  viewButton: {
    backgroundColor: '#6F4EF2',
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 10,
    alignItems: 'center'
  },
  viewButtonText: { color: '#fff', fontWeight: 'bold' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 62,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff'
  },
  navIcon: { alignItems: 'center', flex: 1 },
  navCircle: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#ddd', marginBottom: 2
  },
  navCircleActive: { backgroundColor: '#6F4EF2' },
  navLabel: { fontSize: 10, color: '#888' },
  navLabelActive: { color: '#6F4EF2', fontWeight: 'bold' },
  badge: {
    position: 'absolute',
    right: 10,
    top: -2,
    backgroundColor: '#F44',
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});

const dashboardStyles = {
  section: { backgroundColor: '#2a3656', borderRadius: 16, margin: 16, padding: 18, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statLabel: { color: '#b2becd', fontSize: 15 },
  statValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
};

// --- JS week calculation helpers ---
  function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  function getSunday(d) {
    d = new Date(d);
    var day = d.getDay(), diff = d.getDate() - day + 7;
    return new Date(d.setDate(diff));
  }
  function formatShort(date) {
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  }