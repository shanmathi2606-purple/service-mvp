import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Building2, User } from 'lucide-react-native';
import { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import LunarLogo from '../../components/LunarLogo';
import { auth, db } from "../../firebase";
import { sendVerificationEmail } from "./emailVerification";

export default function SignupScreen({ navigation, route }) {
  // Get user type from navigation params (customer or business)
  const userType = route?.params?.userType || "customer";
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validate DOB format (DD/MM/YYYY)
  const validateDOB = (dob) => {
    const dobRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dob.match(dobRegex);
    if (!match) return false;
    
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    const year = parseInt(match[3]);
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear() - 13) return false; // Minimum age 13
    
    return true;
  };

  // Format DOB input automatically
  const formatDOB = (text) => {
    // Remove non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Apply formatting
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      // Validation
      if (!name.trim()) {
        Alert.alert("Validation Error", "Please enter your full name");
        return;
      }
      if (!username.trim()) {
        Alert.alert("Validation Error", "Please enter a username");
        return;
      }
      if (!email.trim()) {
        Alert.alert("Validation Error", "Please enter your email address");
        return;
      }
      if (!password) {
        Alert.alert("Validation Error", "Please enter a password");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Validation Error", "Passwords do not match");
        return;
      }
      if (password.length < 6) {
        Alert.alert("Validation Error", "Password must be at least 6 characters long");
        return;
      }
      if (!mobileNumber.trim()) {
        Alert.alert("Validation Error", "Please enter your mobile number");
        return;
      }
      if (!dateOfBirth.trim()) {
        Alert.alert("Validation Error", "Please enter your date of birth");
        return;
      }
      if (!validateDOB(dateOfBirth)) {
        Alert.alert("Validation Error", "Please enter a valid date of birth (DD/MM/YYYY)");
        return;
      }

      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Send email verification
      await sendVerificationEmail(user);

      // Save additional user data to Firestore (users collection)
      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        mobileNumber: mobileNumber.trim(),
        dateOfBirth: dateOfBirth,
        role: userType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // If business, also create a business profile in 'businesses' collection
      if (userType === "business") {

        await setDoc(doc(db, "businesses", user.uid), {
          name: name.trim(),
          username: username.trim(),
          email: email.trim(),
          mobileNumber: mobileNumber.trim(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ownerUid: user.uid,
        });
      }

      // If customer, also create a customer profile in 'customers' collection
      if (userType === "customer") {
        await setDoc(doc(db, "customers", user.uid), {
          name: name.trim(),
          username: username.trim(),
          email: email.trim(),
          mobileNumber: mobileNumber.trim(),
          dateOfBirth: dateOfBirth,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          userUid: user.uid,
        });
      }

      // Show single pop-up and return to login
      Alert.alert(
        "Please check your email inbox",
        "A verification link has been sent. Please verify your email before logging in. You can now exit the app and log in later.",
        [
          {
            text: "OK",
            onPress: () => navigation.replace("Login")
          }
        ]
      );

    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "An error occurred during signup";
      let alertTitle = "Signup Failed";
      if (error.code === 'auth/email-already-in-use') {
        alertTitle = "Email Already Registered";
        errorMessage = "This email is already associated with an account. Would you like to sign in instead?";
        Alert.alert(
          alertTitle,
          errorMessage,
          [
            {
              text: "Try Different Email",
              style: "cancel"
            },
            {
              text: "Sign In",
              onPress: () => navigation.navigate("Login")
            }
          ]
        );
        return;
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password (at least 6 characters)";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/password accounts are not enabled. Please contact support.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else {
        errorMessage = `Signup failed: ${error.message}`;
      }
      Alert.alert(alertTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background matching LoginScreen */}
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
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#87CEEB" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <LunarLogo size={100} />
        </View>
        <Text style={styles.welcomeText}>Join LUNAR</Text>
        <Text style={styles.welcomeSubtext}>Create your {userType} account</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {/* Profile Information Section */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            {userType === "business" ? (
              <Building2 size={18} color="#87CEEB" />
            ) : (
              <User size={18} color="#87CEEB" />
            )}
            {" "}Profile Information
          </Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="rgba(135, 206, 235, 0.7)"
              autoCapitalize="words"
            />
          </View>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="rgba(135, 206, 235, 0.7)"
              autoCapitalize="none"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="rgba(135, 206, 235, 0.7)"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Mobile Number Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              placeholderTextColor="rgba(135, 206, 235, 0.7)"
              keyboardType="phone-pad"
            />
          </View>

          {/* Date of Birth Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Date of Birth (DD/MM/YYYY)"
              value={dateOfBirth}
              onChangeText={(text) => setDateOfBirth(formatDOB(text))}
              placeholderTextColor="rgba(135, 206, 235, 0.7)"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password (min 6 characters)"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="rgba(135, 206, 235, 0.7)"
            />
            <TouchableOpacity 
              onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
              style={styles.eyeIconContainer}
            >
              <Feather name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="#87CEEB" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!isConfirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="rgba(135, 206, 235, 0.7)"
            />
            <TouchableOpacity 
              onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} 
              style={styles.eyeIconContainer}
            >
              <Feather name={isConfirmPasswordVisible ? "eye" : "eye-off"} size={20} color="#87CEEB" />
            </TouchableOpacity>
          </View>

          {/* Signup Button */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.disabledButton]} 
            onPress={handleSignup}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#BDC3C7', '#95A5A6'] : ['#87CEEB', '#FFFFFF', '#ADD8E6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Feather
                name={userType === "business" ? "briefcase" : "user-plus"}
                size={18}
                color="#1a1a2e"
                style={{ marginRight: 8 }}
              />
            
              <Text style={styles.buttonText}>
                {loading ? "Creating Account..." : `CREATE ${userType.toUpperCase()} ACCOUNT`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.bottomPrompt}>
            <Text style={styles.bottomText}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.signupLink}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#E6E6FA',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
    marginBottom: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 235, 0.3)',
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 16 : 13,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  eyeIconContainer: {
    padding: 5,
  },
  button: {
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  disabledButton: {
    elevation: 2,
    shadowOpacity: 0.1,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#1a1a2e',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.8,
  },
  bottomPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  bottomText: {
    color: '#E6E6FA',
    fontSize: 14,
    fontWeight: '400',
  },
  signupLink: {
    color: '#87CEEB',
    fontWeight: '600',
    fontSize: 14,
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
    width: 70,
    height: 70,
    top: '15%',
    right: '8%',
  },
  element2: {
    width: 50,
    height: 50,
    top: '65%',
    left: '5%',
  },
  element3: {
    width: 35,
    height: 35,
    top: '85%',
    right: '25%',
  },
});
