import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { Calendar, MessageCircle, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BusinessBottomNav from '../../../components/BusinessBottomNav';
import BusinessTopBar from '../../../components/BusinessTopBar';
import { auth, db } from '../../firebase';

// Modern styles for profile, reminders, dashboard
const modernStyles = StyleSheet.create({
    summaryCard: {
      backgroundColor: '#fff',
      borderRadius: 24,
      marginHorizontal: 18,
      marginTop: 18,
      marginBottom: 10,
      padding: 22,
      shadowColor: '#000',
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 3,
      borderWidth: 0.5,
      borderColor: '#192841', // Navy blue as topbar
    },
    summaryStat: {
      color: '#888',
      fontSize: 13,
      marginRight: 8,
    },
    summaryStatNum: {
      color: '#0c003a',
      fontWeight: 'bold',
      fontSize: 15,
    },
  container: {
    flex: 1,
    backgroundColor: '#F7F5EF',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 10,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
    borderRadius: 32,
    backgroundColor: '#fff',
    padding: 2,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e6e6fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 28,
    color: '#6F4EF2',
    fontWeight: 'bold',
  },
  greeting: {
    color: '#888',
    fontSize: 15,
    marginBottom: 2,
  },
  businessName: {
    color: '#2a3656',
    fontWeight: 'bold',
    fontSize: 19,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 0,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#192841', // Navy blue as topbar
  },
  sectionTitle: {
    color: '#0a2540',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionSub: {
    color: '#0a2540',
    fontSize: 13,
    marginBottom: 10,
  },
  sectionEmpty: {
    color: '#bbb',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
  reminderCard: {
    backgroundColor: '#f7f7fd',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: '#192841', // Navy blue as topbar
  },
  reminderMain: {
    color: '#2a3656',
    fontWeight: '600',
    fontSize: 15,
  },
  reminderSub: {
    color: '#888',
    fontSize: 13,
    marginBottom: 2,
  },
  reminderNote: {
    color: '#6F4EF2',
    fontSize: 12,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#e0e0fd',
    borderRadius: 14,
    marginHorizontal: 4,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  statLabel: {
    color: '#888',
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '600',
  },
  statValue: {
    color: '#2a3656',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickActionCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  quickActionCircle: {
    backgroundColor: '#e6e6fa',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  quickActionLabel: {
    color: '#2a3656',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default function BusinessHomeScreen({ navigation }) {
  const [tab, setTab] = useState('Ongoing');
  const [showHistory, setShowHistory] = useState(false);
  // Dashboard state
  const [bookings, setBookings] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [reminders, setReminders] = useState([]);
  const UPCOMING_DAYS = 3; // Show bookings for today + next 2 days
  const [totalBookingsThisWeek, setTotalBookingsThisWeek] = useState(0);
  const [totalRevenueThisWeek, setTotalRevenueThisWeek] = useState(0);
  const [weekRange, setWeekRange] = useState('');

  const [businessProfile, setBusinessProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      // Fetch bookings for this business
      const q = query(collection(db, 'bookings'), where('businessId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snap) => {
        let revenue = 0;
        let count = 0;
        let upcomingReminders = [];
        const today = new Date();
        // Create array of dates for today + next (UPCOMING_DAYS-1) days
        const upcomingDates = Array.from({ length: UPCOMING_DAYS }, (_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          return d.toISOString().slice(0, 10);
        });
        snap.forEach(doc => {
          const data = doc.data();
          count++;
          // Only use menu.price for revenue calculation
          let bookingPrice = 0;
          if (data.menu && typeof data.menu === 'object' && data.menu.price !== undefined) {
            let priceValue = data.menu.price;
            if (typeof priceValue === 'string') {
              priceValue = priceValue.replace(/[^0-9.]/g, ''); // Remove $ and non-numeric chars
            }
            bookingPrice = Number(priceValue);
          } else if (typeof data.menu === 'string' && businessProfile?.menu) {
            // Fallback: find price from businessProfile.menu by menu name
            const menuItem = businessProfile.menu.find(
              (m) => m.name && m.name.toLowerCase() === data.menu.toLowerCase()
            );
            if (menuItem && menuItem.price !== undefined) {
              bookingPrice = Number(menuItem.price);
            }
          }
          revenue += isNaN(bookingPrice) ? 0 : bookingPrice;
          // Bookings for today or next few days
          if (upcomingDates.includes(data.date)) {
            upcomingReminders.push(data);
          }
        });
        // Sort reminders by date and time
        upcomingReminders.sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          if (a.time && b.time) return a.time.localeCompare(b.time);
          return 0;
        });
        setBookings(snap.docs.map(d => d.data()));
        setTotalRevenue(revenue);
        setTotalBookings(count);
        setReminders(upcomingReminders);
      });
      return unsubscribe;
    };

    // Fetch business profile
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      // Assume business profiles are stored in 'businessProfiles' collection with doc id = user.uid
      const profileRef = doc(db, 'businessProfiles', user.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setBusinessProfile(profileSnap.data());
      } else {
        setBusinessProfile(null);
      }
    };

    fetchData();
    fetchProfile();
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
            // Only use menu.price for weekly revenue calculation
            let bookingPrice = 0;
            if (b.menu && typeof b.menu === 'object' && b.menu.price !== undefined) {
              let priceValue = b.menu.price;
              if (typeof priceValue === 'string') {
                priceValue = priceValue.replace(/[^0-9.]/g, '');
              }
              bookingPrice = Number(priceValue);
            } else if (typeof b.menu === 'string' && businessProfile?.menu) {
              const menuItem = businessProfile.menu.find(
                (m) => m.name && m.name.toLowerCase() === b.menu.toLowerCase()
              );
              if (menuItem && menuItem.price !== undefined) {
                bookingPrice = Number(menuItem.price);
              }
            }
            weekRevenue += isNaN(bookingPrice) ? 0 : bookingPrice;
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
        <View style={modernStyles.container}>
          {/* Top Header Bar */}
          <BusinessTopBar navigation={navigation} title="Business Home" />

          {/* Modern Business Summary Card */}
          <View style={modernStyles.summaryCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={modernStyles.avatarShadow}>
                <View style={modernStyles.avatarCircle}>
                  <Text style={modernStyles.avatarInitial}>
                    {businessProfile?.name?.[0]?.toUpperCase() || 'B'}
                  </Text>
                </View>
              </View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={modernStyles.greeting}>Welcome back,</Text>
                <Text style={modernStyles.businessName}>
                  {businessProfile?.name || 'Your Business Name'}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <Text style={modernStyles.summaryStat}><Text style={modernStyles.summaryStatNum}>{reminders.length}</Text> bookings today</Text>
                  <Text style={[modernStyles.summaryStat, { marginLeft: 18 }]}><Text style={modernStyles.summaryStatNum}>{totalRevenue}</Text> total revenue</Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }}>
              <TouchableOpacity style={modernStyles.quickActionCard} onPress={() => navigation.navigate('BusinessCalendar')}>
                <View style={modernStyles.quickActionCircle}>
                  <Calendar color="#6F4EF2" size={22} />
                </View>
                <Text style={modernStyles.quickActionLabel}>Calendar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modernStyles.quickActionCard} onPress={() => navigation.navigate('AddBookingScreen')}>
                <View style={modernStyles.quickActionCircle}>
                  <Plus color="#6F4EF2" size={22} />
                </View>
                <Text style={modernStyles.quickActionLabel}>Add Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modernStyles.quickActionCard} onPress={() => navigation.navigate('ChatScreen')}>
                <View style={modernStyles.quickActionCircle}>
                  <MessageCircle color="#6F4EF2" size={22} />
                </View>
                <Text style={modernStyles.quickActionLabel}>Inbox</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 18 }}>
              <Text style={modernStyles.tipsTitle}>Tips for Success</Text>
              <Text style={modernStyles.tipsText}>
                • Respond to bookings quickly for better ratings.{"\n"}
                • Keep your calendar up to date.{"\n"}
                • Personalize your profile for more bookings!
              </Text>
            </View>
          </View>


          {/* Reminders Section */}
          <View style={modernStyles.sectionCard}>
            <Text style={modernStyles.sectionTitle}>Upcoming Reminders (Next 3 Days)</Text>
            {reminders.length === 0 ? (
              <Text style={modernStyles.sectionEmpty}>No upcoming reminders.</Text>
            ) : (
              reminders.map((r, i) => (
                <View key={i} style={modernStyles.reminderCard}>
                  <Text style={modernStyles.reminderMain}>{r.customerName || r.customerId || 'Customer'} - {r.time}</Text>
                  <Text style={modernStyles.reminderSub}>{r.service || 'Service'} | {r.date}</Text>
                  {r.note ? <Text style={modernStyles.reminderNote}>Note: {r.note}</Text> : null}
                </View>
              ))
            )}
          </View>

          {/* Dashboard Section */}
          <View style={modernStyles.sectionCard}>
            <Text style={modernStyles.sectionTitle}>Dashboard</Text>
            <Text style={modernStyles.sectionSub}>This week: {weekRange}</Text>
            <View style={modernStyles.statsRow}>
              <View style={modernStyles.statCard}>
                <Text style={modernStyles.statLabel}>Bookings (Week)</Text>
                <Text style={modernStyles.statValue}>{totalBookingsThisWeek}</Text>
              </View>
              <View style={modernStyles.statCard}>
                <Text style={modernStyles.statLabel}>Revenue (Week)</Text>
                <Text style={modernStyles.statValue}>${totalRevenueThisWeek}</Text>
              </View>
            </View>
            <View style={modernStyles.statsRow}>
              <View style={modernStyles.statCard}>
                <Text style={modernStyles.statLabel}>Revenue (All)</Text>
                <Text style={modernStyles.statValue}>${totalRevenue}</Text>
              </View>
              <View style={modernStyles.statCard}>
                <Text style={modernStyles.statLabel}>Bookings (All)</Text>
                <Text style={modernStyles.statValue}>{totalBookings}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <BusinessBottomNav navigation={navigation} active="Home" />
    </View>
  );
}


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