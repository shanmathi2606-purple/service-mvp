import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  calendarSection: {
    marginBottom: 16,
    width: '92%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  dateDropdownBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a2540',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0a2540',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 4,
    width: '100%',
    alignSelf: 'center',
  },
  dateDropdownText: {
    fontSize: 14,
    color: '#fff',
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
    backgroundColor: '#0a2540',
  },
  modalPickerText: {
    fontSize: 14,
    color: '#34495E',
  },
  modalPickerTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  modalDoneButton: {
    backgroundColor: '#0a2540',
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
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    elevation: 3,
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
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  weekdayText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7F8C8D',
    textAlign: 'center',
    width: 38,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    fontSize: 16,
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
    width: 38,
    height: 38,
  },
  timeSection: {
    marginBottom: 16,
    width: '92%',
    alignSelf: 'center',
  },
  selectedDateText: {
    fontSize: 13,
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
    backgroundColor: '#E8F4F8',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});


import { Feather } from '@expo/vector-icons';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BusinessBottomNav from '../../../components/BusinessBottomNav';
import BusinessTopBar from '../../../components/BusinessTopBar';
import { auth, db } from '../../firebase';


import { useEffect } from 'react';

export default function BusinessCalendarScreen({ navigation }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [availableSlots, setAvailableSlots] = useState({}); // { 'YYYY-MM-DD': ["09:00", ...] }
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customSlot, setCustomSlot] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  // Load slots and note for the selected date from Firestore
  useEffect(() => {
    const fetchAvailability = async () => {
      const user = auth.currentUser;
      if (!user || !selectedDay) return;
      const dateKey = getDateString(selectedDay);
      try {
        const docRef = doc(db, 'availability', user.uid, 'dates', dateKey);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Set slots for this date only
              setAvailableSlots((prev) => ({ ...prev, [dateKey]: data.slots || [] }));
          setNote(data.note || "");
        } else {
          // No data for this date, clear slots/note for this date
          setAvailableSlots((prev) => ({ ...prev, [dateKey]: [] }));
          setNote("");
        }
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay]);
  // Save slots and note for the selected date to Firestore (availability/{businessId}/{date})
  const handleSaveToFirestore = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Not signed in', 'Please sign in to save your availability.');
      return;
    }
    if (!selectedDay) {
      Alert.alert('No date selected', 'Please select a date to save availability.');
      return;
    }
    setSaving(true);
    const dateKey = getDateString(selectedDay);
    try {
      await setDoc(
        doc(db, 'availability', user.uid, 'dates', dateKey),
        {
          slots: (availableSlots[dateKey] || []).map((time) => ({ time, available: true })),
          note: note,
          updatedAt: new Date().toISOString(),
        }
      );
      Alert.alert('Success', 'Availability and note saved for ' + dateKey + '!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save: ' + error.message);
    }
    setSaving(false);
  };

  // Calendar logic
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const yearRange = [];
  for (let i = currentYear; i <= currentYear + 2; i++) yearRange.push(i);
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();
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
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00","18:00"];
    // Helper to get slot object for a time
    function getSlotObj(dateKey, time) {
      const slots = availableSlots[dateKey] || [];
      return slots.find(s => s.time === time);
    }
    // In your time slot rendering (where you map timeSlots), update to:
    // Example usage in your time slot rendering:
    // {timeSlots.map(slot => {
    //   const dateKey = getDateString(selectedDay);
    //   const slotObj = getSlotObj(dateKey, slot);
    //   const isBooked = slotObj && slotObj.available === false;
    //   return (
    //     <View key={slot} style={{ margin: 4, padding: 10, borderRadius: 8, backgroundColor: isBooked ? '#f8d7da' : '#eee' }}>
    //       <Text style={{ color: isBooked ? '#c00' : '#222', fontWeight: isBooked ? 'bold' : 'normal' }}>{slot} {isBooked ? '(Booked)' : ''}</Text>
    //     </View>
    //   );
    // })}
  const isDateDisabled = (d) => {
    if (selectedYear < currentYear) return true;
    if (selectedYear === currentYear && selectedMonth < currentMonth) return true;
    if (selectedYear === currentYear && selectedMonth === currentMonth && d < currentDate) return true;
    return false;
  };
  function getDateString(day) {
    const month = (selectedMonth + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${selectedYear}-${month}-${d}`;
  }

  // Add slot for selected date
  const handleAddSlot = (slot) => {
    if (!selectedDay || !slot.trim()) return;
    const dateKey = getDateString(selectedDay);
    setAvailableSlots((prev) => {
      const prevSlots = prev[dateKey] || [];
      if (prevSlots.includes(slot.trim())) return prev; // Prevent duplicates
      return { ...prev, [dateKey]: [...prevSlots, slot.trim()] };
    });
    setCustomSlot("");
    setDropdownOpen(false);
  };
  // Remove slot
  const handleRemoveSlot = (slot) => {
    if (!selectedDay) return;
    const dateKey = getDateString(selectedDay);
    setAvailableSlots((prev) => {
      const prevSlots = prev[dateKey] || [];
      return { ...prev, [dateKey]: prevSlots.filter((s) => s !== slot) };
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 90}}>
        <BusinessTopBar navigation={navigation} title="Business Calendar" />
        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <Pressable style={styles.dateDropdownBar} onPress={() => setDatePickerVisible(true)}>
            <Text style={styles.dateDropdownText}>{monthNames[selectedMonth]} {selectedYear}</Text>
            <Feather name="chevron-down" size={18} color="#2563eb" />
          </Pressable>
          {/* Modal for month/year selection */}
          <Modal
            visible={datePickerVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setDatePickerVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Month & Year</Text>
                <View style={styles.modalPickerRow}>
                  <View style={styles.modalPickerCol}>
                    {monthNames.map((month, idx) => (
                      <Pressable
                        key={month}
                        style={[styles.modalPickerItem, selectedMonth === idx && styles.modalPickerItemSelected]}
                        onPress={() => setSelectedMonth(idx)}
                      >
                        <Text style={[styles.modalPickerText, selectedMonth === idx && styles.modalPickerTextSelected]}>{month}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <View style={styles.modalPickerCol}>
                    {yearRange.map((year) => (
                      <Pressable
                        key={year}
                        style={[styles.modalPickerItem, selectedYear === year && styles.modalPickerItemSelected]}
                        onPress={() => setSelectedYear(year)}
                      >
                        <Text style={[styles.modalPickerText, selectedYear === year && styles.modalPickerTextSelected]}>{year}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
                <TouchableOpacity style={styles.modalDoneButton} onPress={() => setDatePickerVisible(false)}>
                  <Text style={styles.modalDoneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
                {row.map((d, j) => {
                  if (!d) return <View key={j} style={styles.emptyDay} />;
                  const dateKey = getDateString(d);
                  // Check if any slot is booked for this day
                  const slots = availableSlots[dateKey] || [];
                  const hasBooked = slots.some(s => (typeof s === 'object' ? s.available === false : false));
                  return (
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
                      {/* Green dot if any slot is booked */}
                      {hasBooked && (
                        <View style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#27ae60',
                          position: 'absolute',
                          bottom: 4,
                          right: 4,
                        }} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* List Availability Section for Business */}
        {selectedDay && (
          <>
          <View style={styles.timeSection}>
            <Text style={styles.sectionTitle}>List Availability</Text>
            <Text style={styles.selectedDateText}>
              {monthNames[selectedMonth]} {selectedDay}, {selectedYear}
            </Text>
            {/* Dropdown for time slots */}
            <View style={{ marginBottom: 10 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ECF0F1', padding: 10 }}
                onPress={() => setDropdownOpen(!dropdownOpen)}
              >
                <Text style={{ color: '#34495E' }}>Add from common slots ▼</Text>
              </TouchableOpacity>
              {dropdownOpen && (
                <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ECF0F1', maxHeight: 120, overflow: 'hidden', marginTop: 4 }}>
                  <ScrollView style={{ height: 120 }} showsVerticalScrollIndicator={true}>
                    {timeSlots.map((t) => (
                      <TouchableOpacity key={t} onPress={() => handleAddSlot(t)} style={{ padding: 10 }}>
                        <Text style={{ color: '#34495E' }}>{t}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            {/* Custom input for time slot */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <TextInput
                style={{ flex: 1, borderWidth: 1, borderColor: '#ECF0F1', borderRadius: 8, padding: 10, marginRight: 8 }}
                value={customSlot}
                onChangeText={setCustomSlot}
                placeholder="Custom time (e.g. 14:45)"
                placeholderTextColor="#7F8C8D"
              />
              <TouchableOpacity
                style={{ backgroundColor: '#34495E', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 }}
                onPress={() => handleAddSlot(customSlot)}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Add</Text>
              </TouchableOpacity>
            </View>
            {/* List of slots for this date */}
            <View style={{ marginTop: 10 }}>
              {(availableSlots[getDateString(selectedDay)] || []).length === 0 ? (
                <Text style={{ color: '#888', textAlign: 'center' }}>No slots listed for this day.</Text>
              ) : (
                (availableSlots[getDateString(selectedDay)] || []).map((slot, idx) => {
                  // Support both string and object slot formats
                  const slotLabel = typeof slot === 'string' ? slot : (slot && slot.time ? slot.time : '');
                  const isBooked = typeof slot === 'object' && slot.available === false;
                  return (
                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isBooked ? '#d5f5d5' : '#f5f6fa', borderRadius: 10, padding: 10, marginBottom: 8 }}>
                      <Text style={{ flex: 1, color: isBooked ? '#27ae60' : '#34495E', fontWeight: '600' }}>
                        {slotLabel} {isBooked ? '(Booked)' : ''}
                      </Text>
                      <TouchableOpacity onPress={() => handleRemoveSlot(slotLabel)} disabled={isBooked}>
                        <Feather name="x-circle" size={20} color={isBooked ? '#bbb' : '#e74c3c'} />
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>
          </View>
          {/* Additional Note Section */}
          <View style={{ marginTop: 10, marginBottom: 20, width: '92%', alignSelf: 'center', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#ECF0F1', padding: 14 }}>
            <Text style={{ fontWeight: '700', color: '#34495E', marginBottom: 6 }}>Add Additional Note:</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: '#ECF0F1', borderRadius: 8, padding: 10, minHeight: 40, color: '#34495E' }}
              placeholder="e.g. surcharge, timing request/change"
              placeholderTextColor="#7F8C8D"
              multiline
              numberOfLines={2}
              value={note}
              onChangeText={setNote}
            />
            <TouchableOpacity
              style={{ backgroundColor: saving ? '#aaa' : '#2563eb', borderRadius: 8, paddingVertical: 12, marginTop: 12 }}
              onPress={handleSaveToFirestore}
              disabled={saving}
            >
              <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center', fontSize: 16 }}>{saving ? 'Saving...' : 'Save Availability'}</Text>
            </TouchableOpacity>
          </View>
          </>
        )}
      </ScrollView>
      <BusinessBottomNav navigation={navigation} active="Calendar" />
    </View>
  );
}