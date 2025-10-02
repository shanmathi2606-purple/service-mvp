
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, Dimensions, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../firebase";

// iPhone 14 Plus dimensions
const IPHONE_14_PLUS_WIDTH = 428;
const IPHONE_14_PLUS_HEIGHT = 926;
const { width: deviceWidth } = Dimensions.get("window");
const scale = deviceWidth / IPHONE_14_PLUS_WIDTH;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.replace("Home");
    } catch (e) {
      Alert.alert("Login failed", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with logo */}
        <View style={styles.header}>
          {/* Replace below with your logo image if available */}
          <Text style={styles.headerLogo}>☾ LUNAR</Text>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          <Text style={styles.signInTitle}>Sign in</Text>

          <TextInput
            style={styles.input}
            placeholder="Mobile Number or Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#888"
          />

          {/* Password icon and forgotten password row */}
          <View style={styles.passwordRow}>
            {/* Eye icon placeholder */}
            <Text style={styles.eyeIcon}>👁️</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.forgotPassword}>Forgotten Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom signup prompt */}
        <View style={styles.bottomPrompt}>
          <Text style={styles.bottomText}>
            Don’t have an account?{' '}
            <Text style={styles.signupLink} onPress={() => navigation.navigate("Signup")}>Sign Up</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#83a3b5',
    height: 180 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerLogo: {
    color: '#000',
    fontSize: 40 * scale,
    fontWeight: '700',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24 * scale,
    paddingTop: 32 * scale,
  },
  signInTitle: {
    fontSize: 28 * scale,
    fontWeight: 'bold',
    marginBottom: 24 * scale,
    color: '#111',
    textAlign: 'left',
    textDecorationLine: 'underline',
  },
  input: {
    borderWidth: 1,
    borderColor: '#111',
    borderRadius: 8 * scale,
    backgroundColor: '#fff',
    paddingHorizontal: 16 * scale,
    paddingVertical: Platform.OS === 'ios' ? 14 * scale : 10 * scale,
    fontSize: 16 * scale,
    marginBottom: 18 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 18 * scale,
  },
  eyeIcon: {
    fontSize: 22 * scale,
    marginRight: 8 * scale,
    color: '#888',
  },
  forgotPassword: {
    color: '#b0b7be',
    textDecorationLine: 'underline',
    fontSize: 14 * scale,
  },
  button: {
    borderWidth: 1,
    borderColor: '#111',
    borderRadius: 8 * scale,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14 * scale,
    marginTop: 10 * scale,
    marginBottom: 10 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#222',
    fontWeight: '500',
    fontSize: 18 * scale,
  },
  bottomPrompt: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 18 * scale,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  bottomText: {
    color: '#888',
    fontSize: 16 * scale,
    fontWeight: '500',
  },
    signupLink: {
      color: '#111',
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
  });
