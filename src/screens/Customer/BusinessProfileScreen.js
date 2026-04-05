// src/screens/BusinessProfileScreen.js
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getDoc } from 'firebase/firestore';
import { Calendar as CalendarIcon, Globe, Heart, Mail, MapPin, Phone, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import CustomerBottomNav from '../../../components/CustomerBottomNav';
import { db } from '../../firebase';

// Example locale config (optional)
LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};
LocaleConfig.defaultLocale = 'en';
// ...existing code...
// ...existing code...
const BusinessProfileScreen = ({ navigation, route }) => {
  const { business: initialBusiness } = route.params;
  const [business, setBusiness] = useState(initialBusiness);
  // Defensive fallback for undefined/null fields
  const services = Array.isArray(business?.menu) ? business.menu : [];
  const hours = Array.isArray(business?.hours) ? business.hours : [];

  // Always fetch latest business info from Firestore
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const docRef = doc(db, 'businessProfiles', initialBusiness.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBusiness({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (e) {
        // Optionally handle error
      }
    };
    fetchBusiness();
  }, [initialBusiness.id]);

  // Real-time slot availability listener
  useEffect(() => {
    if (!selectedDate || !business?.id) return;
    const slotDocRef = doc(db, 'availability', business.id, 'dates', selectedDate);
    const unsub = onSnapshot(slotDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSlots(data.slots || []);
        setNote(data.note || "");
      } else {
        setSlots([]);
        setNote("");
      }
      setLoading(false);
    });
    return () => unsub();
  }, [selectedDate, business?.id]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch slots and note for selected date
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'availability', business.id, 'dates', selectedDate);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSlots(data.slots || []);
          setNote(data.note || "");
        } else {
          setSlots([]);
          setNote("");
        }
      } catch (e) {
        setSlots([]);
        setNote("");
      }
      setLoading(false);
    };
    fetchAvailability();
  }, [selectedDate, business.id]);

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    navigation.navigate('Booking', {
      business,
      selectedDate,
      selectedSlot: slot.time,
      note,
    });
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#F7FBFE', '#EEF6FF', '#E3F2FD']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Business Profile</Text>
          <TouchableOpacity style={styles.favoriteButton}>
            <Heart size={24} color="#34495E" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
          {/* Calendar & Availability Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Book a Slot</Text>
            <Calendar
              onDayPress={day => setSelectedDate(day.dateString)}
              markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#34495E' } } : {}}
              style={{ marginBottom: 16, borderRadius: 10 }}
              theme={{
                todayTextColor: '#2563eb',
                selectedDayBackgroundColor: '#34495E',
                arrowColor: '#34495E',
              }}
            />
            {selectedDate && (
              <>
                {loading ? (
                  <Text style={{ color: '#888', textAlign: 'center', marginVertical: 10 }}>Loading slots...</Text>
                ) : slots.length === 0 ? (
                  <Text style={{ color: '#888', textAlign: 'center', marginVertical: 10 }}>No slots available for this day.</Text>
                ) : (
                  <View style={{ marginBottom: 10 }}>
                    {slots.map((slot, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={{ backgroundColor: '#E8F4F8', borderRadius: 8, padding: 12, marginBottom: 8 }}
                        onPress={() => handleSlotSelect(slot)}
                      >
                        <Text style={{ color: '#34495E', fontWeight: '600', fontSize: 16 }}>{slot.time}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {note ? (
                  <View style={{ backgroundColor: '#f5f6fa', borderRadius: 8, padding: 10, marginTop: 6 }}>
                    <Text style={{ color: '#34495E', fontStyle: 'italic' }}>{note}</Text>
                  </View>
                ) : null}
              </>
            )}
          </View>
          {/* Business Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              {business.image ? (
                typeof business.image === 'string' && business.image.length > 0 ? (
                  <Image source={{ uri: business.image }} style={styles.businessLogo} />
                ) : (
                  <Image source={business.image} style={styles.businessLogo} />
                )
              ) : (
                <View style={[styles.businessLogo, { backgroundColor: '#eee', borderRadius: 40 }]} />
              )}
            </View>
            <Text style={styles.businessName}>{business.name}</Text>
            <Text style={styles.businessCategory}>{business.category}</Text>
            
            {/* Rating and Reviews */}
            <View style={styles.ratingContainer}>
              <Star size={20} color="#FFD700" />
              <Text style={styles.ratingText}>{business.rating}</Text>
              <Text style={styles.reviewsText}>({business.reviews} reviews)</Text>
            </View>

            {/* Location */}
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#34495E" />
              <Text style={styles.locationText}>{business.location}</Text>
              <Text style={styles.distanceText}>• {business.distance}</Text>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{business.description}</Text>
          </View>

          {/* Services Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.servicesGrid}>
              {services.length > 0 ? (
                services.map((service, index) => (
                  <View key={index} style={styles.serviceItem}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: '#888' }}>No services listed.</Text>
              )}
            </View>
          </View>

          {/* Business Hours Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Hours</Text>
            <View style={styles.hoursContainer}>
              {hours.length > 0 ? (
                hours.map((hour, index) => (
                  <View key={index} style={styles.hourRow}>
                    <Text style={styles.dayText}>{hour.day}</Text>
                    <Text style={styles.timeText}>{hour.time}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: '#888' }}>No business hours listed.</Text>
              )}
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactContainer}>
              <View style={styles.contactItem}>
                <Phone size={18} color="#34495E" />
                <Text style={styles.contactText}>{business.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <Mail size={18} color="#34495E" />
                <Text style={styles.contactText}>{business.email}</Text>
              </View>
              <View style={styles.contactItem}>
                <Globe size={18} color="#34495E" />
                <Text style={styles.contactText}>{business.website}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {slots.length > 0 && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.bookButton]}
                onPress={() => navigation.navigate("Booking", { business, selectedDate, selectedSlot: null, note })}
              >
                <LinearGradient
                  colors={['#34495E', '#2C3E50']}
                  style={styles.buttonGradient}
                >
                  <CalendarIcon size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.bookButtonText}>Book</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.actionButton, styles.callButton]}
              onPress={() => {/* Add call functionality */}}
            >
              <Phone size={20} color="#34495E" style={{ marginRight: 8 }} />
              <Text style={styles.callButtonText}>Call Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
      <CustomerBottomNav navigation={navigation} active="BusinessProfile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#34495E',
    flex: 1,
    textAlign: 'center',
  },
  favoriteButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 20,
  },
  businessLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  businessName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  businessCategory: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 15,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 5,
  },
  reviewsText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#34495E',
    marginLeft: 5,
  },
  distanceText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 5,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    color: '#34495E',
    lineHeight: 22,
  },
  servicesGrid: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  serviceName: {
    fontSize: 15,
    color: '#2C3E50',
    flex: 1,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#34495E',
  },
  hoursContainer: {
    gap: 8,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 15,
    color: '#2C3E50',
    flex: 1,
  },
  timeText: {
    fontSize: 15,
    color: '#34495E',
  },
  contactContainer: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 15,
    color: '#34495E',
    marginLeft: 12,
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookButton: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  callButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#34495E',
  },
  callButtonText: {
    color: '#34495E',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BusinessProfileScreen;