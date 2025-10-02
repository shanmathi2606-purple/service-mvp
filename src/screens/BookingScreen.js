import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { Alert, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../firebase";

export default function BookingScreen({ navigation }) {
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  // Example: October 2025 calendar (starts on Wednesday)
  const daysInMonth = 31;
  const firstDayOfWeek = 3; // 0=Sun, 1=Mon, ..., 3=Wed
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

  // Example time slots
  const timeSlots = ["09:00", "11:00", "15:00", "17:00", "19:00", "21:00"];

  const save = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return Alert.alert("You must be logged in");
      if (!service || !date || !time) return Alert.alert("Fill all fields");

      await addDoc(collection(db, "appointments"), {
        userId: user.uid,
        service,
        date,
        time,
        status: "confirmed",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Booked!", "Your appointment is saved.");
      navigation.replace("MyBookings");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#83A2B4", paddingVertical: 46, paddingLeft: 17, paddingRight: 123, marginBottom: 33 }}>
          <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/h8M1qYstnf/8lfqp1f1_expires_30_days.png" }} resizeMode="stretch" style={{ width: 45, height: 41 }} />
          <Text style={{ color: "#FFFFFF", fontSize: 40 }}>USERNAME</Text>
        </View>


        {/* Calendar UI Section */}
        <View style={{ alignSelf: "flex-start", backgroundColor: "#EEF6FF", borderRadius: 20, paddingTop: 6, paddingBottom: 41, marginBottom: 18, marginLeft: 59, shadowColor: "#00000012", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 12 }}>
          {/* Month/Year Selector */}
          <View style={{ alignSelf: "flex-start", flexDirection: "row", marginBottom: 12, marginLeft: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 10, marginRight: 8 }}>
              <Text style={{ color: "#191919", fontSize: 14, fontWeight: "bold", marginRight: 5 }}>October</Text>
              <Text style={{ color: "#7F7F7F", fontSize: 14, fontWeight: "bold", width: 6 }}>⌄</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 10 }}>
              <Text style={{ color: "#191919", fontSize: 14, fontWeight: "bold", marginRight: 13 }}>2025</Text>
              <Text style={{ color: "#7F7F7F", fontSize: 14, fontWeight: "bold", width: 6 }}>⌄</Text>
            </View>
          </View>
          {/* Weekday Row */}
          <View style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", marginBottom: 12, marginHorizontal: 16 }}>
            <Text style={{ color: "#7F7F7F", fontSize: 11, marginRight: 21 }}>Sun</Text>
            <Text style={{ color: "#7F7F7F", fontSize: 11, marginRight: 18 }}>Mon</Text>
            <Text style={{ color: "#7F7F7F", fontSize: 11, marginRight: 21 }}>Tue</Text>
            <Text style={{ color: "#7F7F7F", fontSize: 11, marginRight: 18 }}>Wed</Text>
            <Text style={{ color: "#7F7F7F", fontSize: 11, marginRight: 21 }}>Thu</Text>
            <Text style={{ color: "#7F7F7F", fontSize: 11, marginRight: 2 }}>Fri</Text>
            <Text style={{ color: "#7F7F7F", fontSize: 11 }}>Sat</Text>
          </View>
          {/* Date Grid (interactive) */}
          <View style={{ alignSelf: "flex-start", marginHorizontal: 16 }}>
            {calendarRows.map((row, i) => (
              <View key={i} style={{ flexDirection: "row" }}>
                {row.map((d, j) =>
                  d ? (
                    <TouchableOpacity
                      key={j}
                      style={{
                        backgroundColor: selectedDay === d ? "#83A3B5" : "#fff",
                        borderRadius: 18,
                        paddingBottom: 1,
                        marginRight: 2,
                        marginBottom: 2,
                        borderWidth: selectedDay === d ? 2 : 0,
                        borderColor: selectedDay === d ? "#524C4C" : "transparent",
                      }}
                      onPress={() => {
                        setSelectedDay(d);
                        setDate(`2025-10-${d.toString().padStart(2, "0")}`);
                        setSelectedTime("");
                        setTime("");
                      }}
                    >
                      <Text style={{
                        color: selectedDay === d ? "#fff" : "#191919",
                        fontSize: 13,
                        textAlign: "center",
                        width: 35,
                        fontWeight: selectedDay === d ? "bold" : "normal",
                      }}>{d}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View key={j} style={{ width: 37, height: 30 }} />
                  )
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Time slots for selected date */}
        {selectedDay && (
          <View style={{ alignSelf: "flex-start", flexDirection: "row", flexWrap: "wrap", marginBottom: 19, marginLeft: 29 }}>
            {timeSlots.map((slot, idx) => (
              <TouchableOpacity
                key={slot}
                style={{
                  borderColor: selectedTime === slot ? "#839A7F" : "#524C4C",
                  backgroundColor: selectedTime === slot ? "#83A3B5" : "#fff",
                  borderRadius: 8,
                  borderWidth: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 28,
                  marginRight: 10,
                  marginBottom: 10,
                }}
                onPress={() => {
                  setSelectedTime(slot);
                  setTime(slot);
                }}
              >
                <Text style={{
                  color: selectedTime === slot ? "#fff" : "#524C4C",
                  fontSize: 16,
                  fontWeight: "bold",
                }}>{slot}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Booking Form (Firebase logic) */}
        <View style={{ alignItems: "center", marginBottom: 33 }}>
          <Text style={{ color: "#524C4C", fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Book a Service</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: "#83A3B5", borderRadius: 8, padding: 10, width: 250, marginBottom: 12 }}
            value={service}
            onChangeText={setService}
            placeholder="Service (e.g. Lash Lift)"
          />
          <TextInput
            style={{ borderWidth: 1, borderColor: "#83A3B5", borderRadius: 8, padding: 10, width: 250, marginBottom: 12 }}
            value={date}
            onChangeText={setDate}
            placeholder="Date (YYYY-MM-DD)"
          />
          <TextInput
            style={{ borderWidth: 1, borderColor: "#83A3B5", borderRadius: 8, padding: 10, width: 250, marginBottom: 12 }}
            value={time}
            onChangeText={setTime}
            placeholder="Time (HH:MM)"
          />
          <TouchableOpacity style={{ backgroundColor: "#83A3B5", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 30, marginTop: 8 }} onPress={save}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Book Appointment</Text>
          </TouchableOpacity>
        </View>

        {/* ...rest of your Figma layout can be added below, or above, as needed... */}
      </ScrollView>
    </SafeAreaView>
  );
}
