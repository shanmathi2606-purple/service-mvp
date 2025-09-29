import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { auth } from "../firebase";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Missing info", "Enter email and password (min 6 chars).");
        return;
      }
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log("Signup OK:", cred.user.uid);
      Alert.alert("Success", "Account created!");
      navigation.replace("Login");
    } catch (e) {
      console.error("Signup error:", e.code, e.message);
      Alert.alert("Signup failed", `${e.code}\n${e.message}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 8 }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <Button title="Create Account" onPress={handleSignup} />
      <Button title="Back to Login" onPress={() => navigation.replace("Login")} />
    </View>
  );
}
