import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { auth } from "../firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log("Login OK:", cred.user.uid);
      navigation.replace("Home"); // replace avoids back stack to Login
    } catch (e) {
      console.error("Login error:", e.code, e.message);
      Alert.alert("Login failed", `${e.code}\n${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex:1, justifyContent:"center", padding:20, gap:8 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none"
        style={{borderWidth:1, padding:8}} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry
        style={{borderWidth:1, padding:8, marginBottom:8}} />
      <Button title={loading ? "Logging in..." : "LOG IN"} onPress={handleLogin} />
      <Button title="GO TO SIGNUP" onPress={() => navigation.navigate("Signup")} />
    </View>
  );
}
