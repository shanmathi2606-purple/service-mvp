import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { auth, db } from "../firebase";

export default function BookingScreen({ navigation }) {
  const [service, setService] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [time, setTime] = useState(""); // HH:MM

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
    <View style={{ flex:1, padding:20, gap:8, justifyContent:"center" }}>
      <Text>Service</Text>
      <TextInput style={{borderWidth:1, padding:8}} value={service} onChangeText={setService} placeholder="e.g. Lash Lift" />
      <Text>Date (YYYY-MM-DD)</Text>
      <TextInput style={{borderWidth:1, padding:8}} value={date} onChangeText={setDate} placeholder="2025-10-03" />
      <Text>Time (HH:MM)</Text>
      <TextInput style={{borderWidth:1, padding:8}} value={time} onChangeText={setTime} placeholder="14:30" />
      <Button title="Book Appointment" onPress={save} />
    </View>
  );
}
