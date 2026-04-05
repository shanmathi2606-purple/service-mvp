import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LunarLogo from '../../components/LunarLogo';

export default function EmailVerifiedScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />
      <View style={styles.overlay}>
        <LinearGradient
          colors={['rgba(186, 85, 211, 0.2)', 'rgba(147, 112, 219, 0.15)', 'rgba(138, 43, 226, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <View style={styles.logoContainer}>
        <LunarLogo size={140} />
      </View>
      <Text style={styles.title}>Your account has been successfully created.</Text>
      <Text style={styles.subtitle}>
        Please open the app and login via your email. Thank you for signing up!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gradientBackground: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject },
  logoContainer: { marginBottom: 32 },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: '#87CEEB',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 24,
    marginTop: 8,
  },
});
