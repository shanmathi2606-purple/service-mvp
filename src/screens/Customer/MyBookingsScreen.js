import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomerBottomNav from '../../../components/CustomerBottomNav';
import { auth, db } from "../../firebase";

export default function MyBookingsScreen({ navigation }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("customerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate("Booking")}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.serviceName}>{item.service}</Text>
              <View style={[styles.statusBadge, 
                item.status === 'confirmed' ? styles.confirmedBadge : 
                item.status === 'pending' ? styles.pendingBadge : styles.cancelledBadge
              ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.dateTime}>📅 {item.date} at {item.time}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {/* Add Lucide calendar icon if needed */}
            <Text style={styles.emptyTitle}>No Bookings Yet</Text>
            <Text style={styles.emptySubtitle}>Tap the + button to make your first booking</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => navigation.navigate("Booking")}
            >
              <Text style={styles.emptyButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate("Booking")}
      >
        {/* Add Lucide plus icon if needed */}
      </TouchableOpacity>
      <CustomerBottomNav navigation={navigation} active="MyBookings" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FBFE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#34495E',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  addButton: {
    backgroundColor: '#34495E',
    borderRadius: 20,
    padding: 8,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#EEF3F7',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  confirmedBadge: {
    backgroundColor: '#D5F5D5',
  },
  pendingBadge: {
    backgroundColor: '#FFF3CD',
  },
  cancelledBadge: {
    backgroundColor: '#F8D7DA',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
    textTransform: 'capitalize',
  },
  cardDetails: {
    marginTop: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#34495E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#34495E',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
