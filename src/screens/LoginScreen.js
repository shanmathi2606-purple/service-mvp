
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Dimensions, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from "../firebase";
import LunarLogo from '../components/LunarLogo';

// iPhone 14 Plus dimensions
const IPHONE_14_PLUS_WIDTH = 428;
const IPHONE_14_PLUS_HEIGHT = 926;
const { width: deviceWidth } = Dimensions.get("window");
const scale = deviceWidth / IPHONE_14_PLUS_WIDTH;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("customer"); // "customer" or "business"
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      
      // Check user role in Firestore (optional: for future role-based validation)
      try {
        const userDoc = await getDoc(doc(db, "users", cred.user.uid));
        const userData = userDoc.data();
        
        // If user data exists and has a role, you could validate it matches loginType
        if (userData && userData.role && userData.role !== loginType) {
          Alert.alert(
            "Login Type Mismatch", 
            `This account is registered as ${userData.role}. Please select the correct login type.`
          );
          return;
        }
      } catch (error) {
        console.log("User document not found, proceeding with login");
      }
      
      // Navigate based on login type
      if (loginType === "business") {
        navigation.replace("BusinessBookings"); // Navigate to business dashboard
      } else {
        navigation.replace("Home"); // Navigate to customer home
      }
    } catch (e) {
      Alert.alert("Login failed", e.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background matching SplashScreen */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />
      
      {/* Animated Background Overlay */}
      <View style={styles.backgroundOverlay}>
        <LinearGradient
          colors={['rgba(186, 85, 211, 0.2)', 'rgba(147, 112, 219, 0.15)', 'rgba(138, 43, 226, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {/* Header with LUNAR Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <LunarLogo size={120} />
        </View>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.welcomeSubtext}>Sign in to continue</Text>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Login Type Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              loginType === "customer" ? styles.toggleButtonActive : styles.toggleButtonInactive
            ]}
            onPress={() => setLoginType("customer")}
          >
            <Ionicons 
              name="person" 
              size={18} 
              color={loginType === "customer" ? "#FFFFFF" : "#87CEEB"} 
              style={{ marginRight: 8 }}
            />
            <Text style={[
              styles.toggleText,
              loginType === "customer" ? styles.toggleTextActive : styles.toggleTextInactive
            ]}>
              Customer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              loginType === "business" ? styles.toggleButtonActive : styles.toggleButtonInactive
            ]}
            onPress={() => setLoginType("business")}
          >
            <Ionicons 
              name="business" 
              size={18} 
              color={loginType === "business" ? "#FFFFFF" : "#87CEEB"} 
              style={{ marginRight: 8 }}
            />
            <Text style={[
              styles.toggleText,
              loginType === "business" ? styles.toggleTextActive : styles.toggleTextInactive
            ]}>
              Business
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#87CEEB" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number or Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="rgba(135, 206, 235, 0.7)"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#87CEEB" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="rgba(135, 206, 235, 0.7)"
          />
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
            style={styles.eyeIconContainer}
          >
            <Ionicons 
              name={isPasswordVisible ? "eye" : "eye-off"} 
              size={20} 
              color="#87CEEB" 
            />
          </TouchableOpacity>
        </View>

        {/* Forgotten Password */}
        <TouchableOpacity onPress={() => {}} style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPassword}>Forgotten Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <LinearGradient
            colors={['#87CEEB', '#FFFFFF', '#ADD8E6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Ionicons 
              name={loginType === "business" ? "business" : "person"} 
              size={20} 
              color="#1a1a2e" 
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>
              {loginType === "business" ? "LOGIN AS BUSINESS" : "LOGIN AS CUSTOMER"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Bottom signup prompt */}
      <View style={styles.bottomPrompt}>
        <Text style={styles.bottomText}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup", { userType: loginType })}>
          <Text style={styles.signupLink}>
            Sign Up as {loginType === "business" ? "Business" : "Customer"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Decorative Elements */}
      <View style={styles.decorativeElements}>
        <View style={[styles.floatingElement, styles.element1]} />
        <View style={[styles.floatingElement, styles.element2]} />
        <View style={[styles.floatingElement, styles.element3]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backgroundOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#E6E6FA',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 235, 0.3)',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(135, 206, 235, 0.3)',
  },
  toggleButtonInactive: {
    backgroundColor: 'transparent',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  toggleTextInactive: {
    color: '#87CEEB',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 235, 0.3)',
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 18 : 15,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  eyeIconContainer: {
    padding: 5,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotPassword: {
    color: '#87CEEB',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#1a1a2e',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
  bottomPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 30,
  },
  bottomText: {
    color: '#E6E6FA',
    fontSize: 15,
    fontWeight: '400',
  },
  signupLink: {
    color: '#87CEEB',
    fontWeight: '600',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(135, 206, 235, 0.1)',
  },
  element1: {
    width: 80,
    height: 80,
    top: '20%',
    right: '10%',
  },
  element2: {
    width: 60,
    height: 60,
    top: '60%',
    left: '5%',
  },
  element3: {
    width: 40,
    height: 40,
    top: '80%',
    right: '20%',
  },
});