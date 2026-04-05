import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import BusinessBottomNav from '../../../components/BusinessBottomNav';
import { auth, db } from "../../firebase";

export default function BusinessBookingsScreen({ navigation }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("businessId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings (Business)</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.serviceName}>{item.service}</Text>
              <Text style={styles.customerName}>Customer: {item.customerId}</Text>
              <View style={[styles.statusBadge, 
                item.status === 'confirmed' ? styles.confirmedBadge : 
                item.status === 'pending' ? styles.pendingBadge : styles.cancelledBadge
              ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.dateTime}>📅 {item.date} at {item.time}</Text>
              <Text style={styles.note}>{item.note}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Bookings Yet</Text>
          </View>
        }
      />
      <BusinessBottomNav navigation={navigation} active="BusinessBookings" />
    </View>
  );
}

// Removed duplicate styles definition. Only keep the dark theme styles below.
const styles = {
  container: { flex: 1, backgroundColor: '#181824' },
  section: { backgroundColor: '#23233a', borderRadius: 16, margin: 16, padding: 18, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statLabel: { color: '#b2becd', fontSize: 15 },
  statValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#23233a', marginVertical: 12 },
};

export default function BusinessBookingsScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [reminders, setReminders] = useState([]);

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

  return (
    <View style={styles.container}>
      <BusinessTopBar navigation={navigation} title="Business Home" />
      {/* Bookings Reminder Section */}
      <View style={[styles.section, { marginTop: 24, backgroundColor: '#1a1a2e' }]}> 
        <Text style={styles.sectionTitle}>Bookings Reminder</Text>
        {reminders.length === 0 ? (
          <Text style={{ color: '#b2becd' }}>No bookings for today.</Text>
        ) : (
          reminders.map((b, i) => (
            <View key={i} style={{ marginBottom: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>{b.customerName || 'Customer'} - {b.time}</Text>
              <Text style={{ color: '#b2becd', fontSize: 13 }}>{b.service || 'Service'} | {b.date}</Text>
            </View>
          ))
        )}
      </View>
      {/* Dashboard Section */}
      <View style={[styles.section, { flex: 1, backgroundColor: '#23233a' }]}> 
        <Text style={styles.sectionTitle}>Dashboard</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Revenue (All Time)</Text>
          <Text style={styles.statValue}>${totalRevenue}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Bookings</Text>
          <Text style={styles.statValue}>{totalBookings}</Text>
        </View>
        {/* Add more analytics here if needed */}
      </View>
      <BusinessBottomNav navigation={navigation} active="Calendar" />
    </View>
  );
}

function NavIcon({ label }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2196f3', marginBottom: 2 }} />
      <Text style={{ color: '#fff', fontSize: 12 }}>{label}</Text>
    </View>
  );
}
