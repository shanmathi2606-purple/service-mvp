// src/screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LunarLogo from '../components/LunarLogo';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation sequence
    const animateSequence = () => {
      // First: Fade in the background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        // Second: Scale and fade in the logo
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Third: Hold for a moment, then fade out and navigate
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(logoOpacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
            ]).start(() => {
              // Navigate to Login screen
              navigation.replace('Login');
            });
          }, 1500); // Hold for 1.5 seconds
        });
      });
    };

    animateSequence();
  }, [fadeAnim, scaleAnim, logoOpacity, navigation]);

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />
      
      {/* Animated Background Overlay */}
      <Animated.View 
        style={[
          styles.backgroundOverlay,
          { opacity: fadeAnim }
        ]}
      >
        <LinearGradient
          colors={['rgba(186, 85, 211, 0.3)', 'rgba(147, 112, 219, 0.2)', 'rgba(138, 43, 226, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Logo Container */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Custom LUNAR Logo with 3D Crescent Moons - MUCH BIGGER */}
        <View style={styles.logoPlaceholder}>
          <LunarLogo size={220} />
        </View>
        
        {/* App tagline - Logo already contains LUNAR text */}
        <Text style={styles.appTagline}>Your Service Booking Platform</Text>
      </Animated.View>

      {/* Floating particles animation */}
      <View style={styles.particleContainer}>
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                opacity: fadeAnim,
                left: `${20 + index * 15}%`,
                top: `${30 + (index % 3) * 20}%`,
                transform: [{
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5 + (index * 0.1)]
                  })
                }]
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholder: {
    width: 240,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  // Style for when you add your actual lunar logo image
  logoImage: {
    width: 100,
    height: 100,
  },
  moonContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moonShape: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  moonGradient: {
    flex: 1,
    position: 'relative',
  },
  crater1: {
    position: 'absolute',
    top: 20,
    left: 25,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  crater2: {
    position: 'absolute',
    top: 45,
    left: 15,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  crater3: {
    position: 'absolute',
    top: 35,
    right: 20,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  crescent: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0f3460',
    opacity: 0.6,
  },
  glow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  appTagline: {
    fontSize: 16,
    color: '#E6E6FA',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 1,
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.6)',
  },
});

export default SplashScreen;