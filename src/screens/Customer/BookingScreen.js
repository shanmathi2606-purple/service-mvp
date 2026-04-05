import { Feather } from '@expo/vector-icons';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CustomerBottomNav from '../../../components/CustomerBottomNav';
import { auth, db } from "../../firebase";

export default function BookingScreen({ navigation, route }) {
  // Accept params from navigation (customer flow)
  const { business, selectedDate, selectedSlot, note: prefilledNote } = route?.params || {};
  const [service, setService] = useState("");
  // selectedDay: number (day of month), selectedTime: string (time slot)
  const [selectedDay, setSelectedDay] = useState(selectedDate ? new Date(selectedDate).getDate() : null);
  const [selectedTime, setSelectedTime] = useState(selectedSlot || "");
  const [date, setDate] = useState(selectedDate || null);
  const [time, setTime] = useState(selectedSlot || "");
  const [note, setNote] = useState(prefilledNote || "");
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  // Calendar state for month/year selection
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  // ...existing code for calendar state...

  // Get current date for validation
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate year range (current year to +2 years)
  const yearRange = [];
  for (let i = currentYear; i <= currentYear + 2; i++) {
    yearRange.push(i);
  }

  // Calculate days in selected month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();
  
  // Generate calendar grid
  const calendarRows = [];
  let day = 1;
  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDayOfWeek) || day > daysInMonth) {
        row.push(null);
      } else {
        row.push(day);
        day++;
      }
    }
    calendarRows.push(row);
  }

  // Time slots
  const timeSlots = [ "09:00", "11:00", "13:00", "15:30", "17:00", "20:00"];

  // Check if date is in the past
  const isDateDisabled = (day) => {
    if (selectedYear < currentYear) return true;
    if (selectedYear === currentYear && selectedMonth < currentMonth) return true;
    if (selectedYear === currentYear && selectedMonth === currentMonth && day < currentDate) return true;
    return false;
  };

  // Booking logic: check slot, create booking, mark slot unavailable
  const save = async () => {
    // Compose date string from selected year/month/day if not already set
    let bookingDate = date;
    if (!bookingDate && selectedDay) {
      // Format: YYYY-MM-DD
      const monthStr = (selectedMonth + 1).toString().padStart(2, '0');
      const dayStr = selectedDay.toString().padStart(2, '0');
      bookingDate = `${selectedYear}-${monthStr}-${dayStr}`;
    }
    const bookingTime = time || selectedTime;
    try {
      const user = auth.currentUser;
      if (!user) return Alert.alert("Please log in", "You must be logged in to book");
      if (!service.trim()) return Alert.alert("Missing Information", "Please enter a service name");
      if (!bookingDate) return Alert.alert("Missing Information", "Please select a date");
      if (!bookingTime) return Alert.alert("Missing Information", "Please select a time");
      if (!business?.id) {
        Alert.alert("Booking Error", "Business information missing. Please try again from the business profile page.");
        return;
      }

      // 1. Check slot availability in Firestore
      const slotDocRef = doc(db, 'availability', business.id, 'dates', bookingDate);
      const slotSnap = await getDoc(slotDocRef);
      let slotAvailable = false;
      if (slotSnap.exists()) {
        const data = slotSnap.data();
        slotAvailable = (data.slots || []).some((s) => s.time === bookingTime && s.available !== false);
      }
      if (!slotAvailable) {
        Alert.alert("Slot Unavailable", "Sorry, this slot has just been booked. Please select another.");
        return;
      }

      // 2. Create booking in 'bookings' collection
      const bookingRef = await addDoc(collection(db, "bookings"), {
        customerId: user.uid,
        businessId: business.id,
        businessName: business.name,
        service: service.trim(),
        date: bookingDate,
        time: bookingTime,
        status: "confirmed",
        note,
        createdAt: serverTimestamp(),
      });

      // 2a. Add notification for business user
      await addDoc(collection(db, "users", business.id, "notifications"), {
        type: "booking",
        bookingId: bookingRef.id,
        customerId: user.uid,
        customerName: user.displayName || user.email || "Customer",
        service: service.trim(),
        date: bookingDate,
        time: bookingTime,
        note,
        read: false,
        createdAt: serverTimestamp(),
      });

      // 2b. Create message thread if not exists
      // Thread id: businessId_customerId (or use a deterministic order)
      const threadId = business.id < user.uid ? `${business.id}_${user.uid}` : `${user.uid}_${business.id}`;
      const threadRef = doc(db, "threads", threadId);
      const threadSnap = await getDoc(threadRef);
      if (!threadSnap.exists()) {
        await setDoc(threadRef, {
          users: [business.id, user.uid],
          businessId: business.id,
          customerId: user.uid,
          lastMessage: `Booking created for ${service.trim()} on ${bookingDate} at ${bookingTime}`,
          lastUpdated: serverTimestamp(),
        });
        // Add initial message
        await addDoc(collection(db, "threads", threadId, "messages"), {
          senderId: user.uid,
          text: `Hi! I just booked ${service.trim()} on ${bookingDate} at ${bookingTime}. ${note ? 'Note: ' + note : ''}`,
          createdAt: serverTimestamp(),
        });
      }

      // 3. Mark slot as unavailable (update slot in Firestore)
      // Remove the slot or set available: false
      const slotsArr = slotSnap.data().slots || [];
      const updatedSlots = slotsArr.map((s) =>
        s.time === bookingTime ? { ...s, available: false } : s
      );
      await updateDoc(slotDocRef, { slots: updatedSlots });

      Alert.alert("Booking Confirmed!", "Your booking has been successfully scheduled.", [
        {
          text: "View My Bookings",
          onPress: () => navigation.navigate("MyBookings")
        },
        {
          text: "Book Another",
          onPress: () => {
            setService("");
            setDate(null);
            setTime("");
            setSelectedDay(null);
            setSelectedTime("");
          }
        }
      ]);
    } catch (e) {
      console.error(e);
      Alert.alert("Booking Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 90}}>
        {/* Header */}
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Book</Text>
        </View>
        {/* Service Input Section */}
        <View style={styles.serviceSection}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.serviceInputContainer}>
            <Feather name="scissors" size={20} color="#2563eb" style={styles.inputIcon} />
            <TextInput
              style={styles.serviceInput}
              value={service}
              onChangeText={setService}
              placeholder="Enter service (e.g., Lash Extensions, Manicure)"
              placeholderTextColor="#7F8C8D"
            />
          </View>
          {/* Pre-fill date/time if provided */}
          {selectedDate && selectedSlot && (
            <View style={{ marginTop: 10, alignItems: 'center' }}>
              <Text style={{ color: '#2563eb', fontWeight: '600' }}>Selected: {selectedDate} at {selectedSlot}</Text>
            </View>
          )}
        </View>
        {/* Additional Requests/Send Note */}
        <View style={styles.noteSection}>
          <Text style={styles.sectionTitle}>Additional Requests / Send Note</Text>
          <View style={styles.noteBarContainer}>
            <TextInput
              style={styles.noteBarInput}
              value={note}
              onChangeText={setNote}
              placeholder="Type any additional requests or notes..."
              placeholderTextColor="#7F8C8D"
              maxLength={100}
              returnKeyType="done"
            />
          </View>
        </View>
        {/* Calendar Section (hide if pre-filled) */}
        {!selectedDate && (
          <View style={styles.calendarSection}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <TouchableOpacity onPress={() => setSelectedMonth(m => m === 0 ? 11 : m - 1)}>
                <Text style={{ fontSize: 18 }}>{'<'}</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 16 }}>{monthNames[selectedMonth]} {selectedYear}</Text>
              <TouchableOpacity onPress={() => setSelectedMonth(m => m === 11 ? 0 : m + 1)}>
                <Text style={{ fontSize: 18 }}>{'>'}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[...Array(daysInMonth)].map((_, i) => {
                const dayNum = i + 1;
                const disabled = isDateDisabled(dayNum);
                return (
                  <TouchableOpacity
                    key={dayNum}
                    style={{
                      width: 36, height: 36, margin: 2, borderRadius: 18,
                      backgroundColor: selectedDay === dayNum ? '#2563eb' : '#eee',
                      alignItems: 'center', justifyContent: 'center',
                      opacity: disabled ? 0.4 : 1
                    }}
                    disabled={disabled}
                    onPress={() => {
                      setSelectedDay(dayNum);
                      setDate(null); // clear prefilled date if any
                    }}
                  >
                    <Text style={{ color: selectedDay === dayNum ? '#fff' : '#222', fontWeight: 'bold' }}>{dayNum}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Time Selection (hide if pre-filled) */}
        {!selectedSlot && (date || selectedDay) && (
          <View style={styles.timeSection}>
            <Text style={styles.sectionTitle}>Available Times</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {timeSlots.map(slot => (
                <TouchableOpacity
                  key={slot}
                  style={{
                    backgroundColor: selectedTime === slot ? '#2563eb' : '#eee',
                    borderRadius: 8, padding: 10, margin: 4,
                  }}
                  onPress={() => {
                    setSelectedTime(slot);
                    setTime(""); // clear prefilled time if any
                  }}
                >
                  <Text style={{ color: selectedTime === slot ? '#fff' : '#222', fontWeight: 'bold' }}>{slot}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Book Button */}
        <View style={styles.bookingSection}>
          <TouchableOpacity 
            style={[styles.bookButton, (!service || !(date || selectedDay) || !(time || selectedTime)) && styles.disabledButton]} 
            onPress={save}
            disabled={!service || !(date || selectedDay) || !(time || selectedTime)}
          >
            <View style={(!service || !(date || selectedDay) || !(time || selectedTime)) ? styles.bookButtonDisabled : styles.bookButtonBlue}>
              <Feather name="calendar" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.bookButtonText}>Book</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomerBottomNav navigation={navigation} active="Booking" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  headerBar: {
    backgroundColor: '#0a2540',
    paddingTop: 40, // reduced from 54
    paddingBottom: 12, // reduced from 18
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 14, // reduced
    borderBottomRightRadius: 14, // reduced
    marginBottom: 6, // reduced
  },
  headerTitle: {
    color: '#fff',
    fontSize: 19, // reduced from 22
    fontWeight: '700',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 8, // reduced from 16
    alignItems: 'center',
  },
  serviceSection: {
    marginTop: 12, // reduced from 20
    marginBottom: 16, // reduced from 25
    width: '92%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 15, // reduced from 18
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10, // reduced from 15
    textAlign: 'center',
  },
  serviceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // reduced from 15
    paddingHorizontal: 10, // reduced from 15
    elevation: 2, // reduced from 3
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    width: '100%',
  },
  inputIcon: {
    marginRight: 7, // reduced from 10
  },
  serviceInput: {
    flex: 1,
    paddingVertical: 10, // reduced from 15
    fontSize: 14, // reduced from 16
    color: '#2C3E50',
  },
  calendarSection: {
    marginBottom: 16, // reduced from 25
    width: '92%',
    alignSelf: 'center',
  },
  dateSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12, // reduced from 20
  },
  monthSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10, // reduced from 12
    padding: 10, // reduced from 15
    flex: 0.48,
    elevation: 2, // reduced from 3
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  monthText: {
    fontSize: 13, // reduced from 16
    fontWeight: '600',
    color: '#34495E',
    textAlign: 'center',
  },
  yearSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10, // reduced from 12
    padding: 10, // reduced from 15
    flex: 0.48,
    elevation: 2, // reduced from 3
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  yearText: {
    fontSize: 13, // reduced from 16
    fontWeight: '600',
    color: '#34495E',
    textAlign: 'center',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // increased from 12
    padding: 18, // increased from 10
    elevation: 3, // increased from 2
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    width: '100%',
    marginTop: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10, // increased from 6
    paddingBottom: 10, // increased from 6
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  weekdayText: {
    fontSize: 15, // increased from 10
    fontWeight: '600',
    color: '#7F8C8D',
    textAlign: 'center',
    width: 38, // increased from 28
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8, // increased from 3
  },
  dayButton: {
    width: 38, // increased from 28
    height: 38, // increased from 28
    borderRadius: 19, // increased from 14
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },
  selectedDay: {
    backgroundColor: '#34495E',
    elevation: 2,
    shadowColor: '#34495E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  disabledDay: {
    backgroundColor: '#ECF0F1',
    opacity: 0.5,
  },
  dayText: {
    fontSize: 16, // increased from 12
    fontWeight: '500',
    color: '#2C3E50',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  disabledDayText: {
    color: '#BDC3C7',
  },
  emptyDay: {
    width: 38, // increased from 28
    height: 38, // increased from 28
  },
  timeSection: {
    marginBottom: 16, // reduced from 25
    width: '92%',
    alignSelf: 'center',
  },
  selectedDateText: {
    fontSize: 13, // reduced from 16
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 10, // reduced from 15
    fontWeight: '600',
    backgroundColor: '#E8F4F8',
    paddingVertical: 7, // reduced from 10
    paddingHorizontal: 10, // reduced from 15
    borderRadius: 10, // reduced from 12
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10, // reduced from 12
    paddingVertical: 8, // reduced from 12
    paddingHorizontal: 14, // reduced from 20
    marginBottom: 7, // reduced from 10
    borderWidth: 2,
    borderColor: '#ECF0F1',
    width: '30%',
    alignItems: 'center',
    elevation: 1, // reduced from 2
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  selectedTimeSlot: {
    backgroundColor: '#34495E',
    borderColor: '#34495E',
    elevation: 2,
    shadowColor: '#34495E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  timeSlotText: {
    fontSize: 12, // reduced from 14
    fontWeight: '600',
    color: '#34495E',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bookingSection: {
    paddingVertical: 12, // reduced from 20
    paddingBottom: 24, // reduced from 40
    width: '92%',
    alignSelf: 'center',
  },
  bookButton: {
    borderRadius: 12, // reduced from 15
    overflow: 'hidden',
    elevation: 4, // reduced from 6
    shadowColor: '#0a2540', // match top bar
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#0a2540', // match top bar
  },
  bookButtonText: {
    fontSize: 14, // reduced from 16
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bookButtonBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a2540', // changed from #2563eb
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#0a2540', // changed from #2563eb
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 1,
  },
  bookButtonDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BDC3C7',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  noteBarContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e6ff',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    marginTop: 4,
    marginBottom: 4,
    width: '100%',
    alignSelf: 'center',
  },
  noteBarInput: {
    fontSize: 13,
    color: '#2C3E50',
    paddingVertical: 6,
    backgroundColor: 'transparent',
    borderWidth: 0,
    width: '100%',
  },
  dateDropdownBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a2540', // changed from #fff
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0a2540', // changed from #e3e6ff
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 4,
    width: '100%',
    alignSelf: 'center',
  },
  dateDropdownText: {
    fontSize: 14,
    color: '#fff', // changed from #2563eb
    fontWeight: '600',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 12,
  },
  modalPickerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalPickerCol: {
    flex: 1,
    alignItems: 'center',
  },
  modalPickerItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 2,
  },
  modalPickerItemSelected: {
    backgroundColor: '#0a2540', // changed from #e3e6ff
  },
  modalPickerText: {
    fontSize: 14,
    color: '#34495E',
  },
  modalPickerTextSelected: {
    color: '#fff', // changed from #2563eb
    fontWeight: '700',
  },
  modalDoneButton: {
    backgroundColor: '#0a2540', // changed from #2563eb
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  modalDoneButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
