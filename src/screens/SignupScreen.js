import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { auth, db } from "../firebase";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Missing info", "Enter email and password (min 6 chars).");
        return;
      }
      setLoading(true);

      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await setDoc(doc(db, "users", cred.user.uid), {
        email: cred.user.email,
        role: "customer",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Account created! You can log in now.");
      navigation.replace("Login");
    } catch (e) {
      console.error("Signup error:", e.code, e.message);
      Alert.alert("Signup failed", `${e.code}\n${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex:1, justifyContent:"center", padding:20, gap:8 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 8 }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <Button
        title={loading ? "Creating..." : "CREATE ACCOUNT"}
        onPress={handleSignup}
      />
      <Button title="BACK TO LOGIN" onPress={() => navigation.replace("Login")} />
    </View>
  );
}
