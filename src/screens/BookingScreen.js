import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from "../firebase";

export default function BookingScreen({ navigation }) {
  const [service, setService] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const save = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return Alert.alert("Please log in", "You must be logged in to book appointments");
      if (!service.trim()) return Alert.alert("Missing Information", "Please enter a service name");
      if (!selectedDay) return Alert.alert("Missing Information", "Please select a date");
      if (!selectedTime) return Alert.alert("Missing Information", "Please select a time");

      const formattedDate = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;

      await addDoc(collection(db, "appointments"), {
        userId: user.uid,
        service: service.trim(),
        date: formattedDate,
        time: selectedTime,
        status: "confirmed",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Booking Confirmed! 🎉", "Your appointment has been successfully scheduled.", [
        {
          text: "View My Bookings",
          onPress: () => navigation.navigate("MyBookings")
        },
        {
          text: "Book Another",
          onPress: () => {
            setService("");
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
      <LinearGradient
        colors={['#F7FBFE', '#EEF6FF', '#E3F2FD']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#34495E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Appointment</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
          {/* Service Input Section */}
          <View style={styles.serviceSection}>
            <Text style={styles.sectionTitle}>💼 Service Details</Text>
            <View style={styles.serviceInputContainer}>
              <Ionicons name="cut" size={20} color="#34495E" style={styles.inputIcon} />
              <TextInput
                style={styles.serviceInput}
                value={service}
                onChangeText={setService}
                placeholder="Enter service (e.g., Lash Extensions, Manicure)"
                placeholderTextColor="#7F8C8D"
              />
            </View>
          </View>

          {/* Calendar Section */}
          <View style={styles.calendarSection}>
            <Text style={styles.sectionTitle}>📅 Select Date</Text>
            
            {/* Month/Year Selectors */}
            <View style={styles.dateSelectors}>
              <TouchableOpacity style={styles.monthSelector}>
                <Text style={styles.monthText}>{monthNames[selectedMonth]}</Text>
                <View style={styles.monthOptions}>
                  {monthNames.map((month, index) => {
                    const isDisabled = selectedYear === currentYear && index < currentMonth;
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.monthOption, isDisabled && styles.disabledOption]}
                        onPress={() => !isDisabled && setSelectedMonth(index)}
                        disabled={isDisabled}
                      >
                        <Text style={[styles.monthOptionText, 
                          selectedMonth === index && styles.selectedOptionText,
                          isDisabled && styles.disabledText
                        ]}>
                          {month}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.yearSelector}>
                <Text style={styles.yearText}>{selectedYear}</Text>
                <View style={styles.yearOptions}>
                  {yearRange.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={styles.yearOption}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text style={[styles.yearOptionText, 
                        selectedYear === year && styles.selectedOptionText
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarContainer}>
              {/* Weekday Headers */}
              <View style={styles.weekdayRow}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <Text key={day} style={styles.weekdayText}>{day}</Text>
                ))}
              </View>
              
              {/* Calendar Days */}
              {calendarRows.map((row, i) => (
                <View key={i} style={styles.calendarRow}>
                  {row.map((d, j) =>
                    d ? (
                      <TouchableOpacity
                        key={j}
                        style={[
                          styles.dayButton,
                          selectedDay === d && styles.selectedDay,
                          isDateDisabled(d) && styles.disabledDay
                        ]}
                        onPress={() => {
                          if (!isDateDisabled(d)) {
                            setSelectedDay(d);
                          }
                        }}
                        disabled={isDateDisabled(d)}
                      >
                        <Text style={[
                          styles.dayText,
                          selectedDay === d && styles.selectedDayText,
                          isDateDisabled(d) && styles.disabledDayText
                        ]}>
                          {d}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View key={j} style={styles.emptyDay} />
                    )
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Time Selection */}
          {selectedDay && (
            <View style={styles.timeSection}>
              <Text style={styles.sectionTitle}>🕐 Available Times</Text>
              <Text style={styles.selectedDateText}>
                {monthNames[selectedMonth]} {selectedDay}, {selectedYear}
              </Text>
              <View style={styles.timeSlots}>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.timeSlot,
                      selectedTime === slot && styles.selectedTimeSlot
                    ]}
                    onPress={() => setSelectedTime(slot)}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      selectedTime === slot && styles.selectedTimeSlotText
                    ]}>
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Book Button */}
          <View style={styles.bookingSection}>
            <TouchableOpacity 
              style={[styles.bookButton, (!service || !selectedDay || !selectedTime) && styles.disabledButton]} 
              onPress={save}
              disabled={!service || !selectedDay || !selectedTime}
            >
              <LinearGradient
                colors={(!service || !selectedDay || !selectedTime) ? ['#BDC3C7', '#95A5A6'] : ['#34495E', '#2C3E50']}
                style={styles.bookButtonGradient}
              >
                <Ionicons name="calendar" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.bookButtonText}>Book Appointment</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#34495E',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  serviceSection: {
    marginTop: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
  },
  serviceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputIcon: {
    marginRight: 10,
  },
  serviceInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#2C3E50',
  },
  calendarSection: {
    marginBottom: 25,
  },
  dateSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    flex: 0.48,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    textAlign: 'center',
  },
  monthOptions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    display: 'none', // Will be toggled via state
  },
  monthOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  monthOptionText: {
    fontSize: 14,
    color: '#34495E',
  },
  selectedOptionText: {
    color: '#3498DB',
    fontWeight: '600',
  },
  disabledOption: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#BDC3C7',
  },
  yearSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    flex: 0.48,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  yearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    textAlign: 'center',
  },
  yearOptions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 1000,
    display: 'none', // Will be toggled via state
  },
  yearOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  yearOptionText: {
    fontSize: 14,
    color: '#34495E',
    textAlign: 'center',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F8C8D',
    textAlign: 'center',
    width: 35,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  dayButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
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
    fontSize: 14,
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
    width: 35,
    height: 35,
  },
  timeSection: {
    marginBottom: 25,
  },
  selectedDateText: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
    backgroundColor: '#E8F4F8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ECF0F1',
    width: '30%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedTimeSlot: {
    backgroundColor: '#34495E',
    borderColor: '#34495E',
    elevation: 4,
    shadowColor: '#34495E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bookingSection: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  bookButton: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  disabledButton: {
    elevation: 2,
    shadowOpacity: 0.1,
  },
  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
