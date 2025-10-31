// src/screens/WellnessScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const WellnessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Gradient Background - Calming Nature Colors */}
      <LinearGradient
        colors={['#F0FFF0', '#E8F5E8', '#D4F1D4', '#B8E6B8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />
      
      {/* Decorative Background Elements */}
      <View style={styles.decorativeBackground}>
        {/* Bubbles */}
        <View style={[styles.bubble, styles.bubble1]} />
        <View style={[styles.bubble, styles.bubble2]} />
        <View style={[styles.bubble, styles.bubble3]} />
        <View style={[styles.bubble, styles.bubble4]} />
        <View style={[styles.bubble, styles.bubble5]} />
        {/* Geometric Elements */}
        <View style={[styles.geometric, styles.leaf1]} />
        <View style={[styles.geometric, styles.leaf2]} />
        <View style={[styles.geometric, styles.circle1]} />
        <View style={[styles.geometric, styles.wave1]} />
        <View style={[styles.geometric, styles.oval1]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#34495E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wellness Services</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Search and Filter Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Wellness & Spa Services</Text>
          <Text style={styles.sectionSubtitle}>Relax and rejuvenate with premium wellness services</Text>
        </View>

        {/* Wellness Business Cards */}
        <View style={styles.businessSection}>
          <Text style={styles.businessTitle}>Popular Wellness Centers</Text>
          
          {/* Haily Home Spa */}
          <TouchableOpacity style={styles.card}>
            <Image source={require("../../assets/images/Haily Home Spa.png")} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Haily Home Spa</Text>
              <Text style={styles.cardSubtitle}>📍 Farrer Park, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.1 (28)</Text>
              <Text style={styles.cardServices}>Home Spa • Massage • Aromatherapy</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>6.7 km</Text>
              <Text style={styles.price}>From $80</Text>
            </View>
          </TouchableOpacity>

          {/* Jills Head Spa */}
          <TouchableOpacity style={styles.card}>
            <Image source={require("../../assets/images/Jills Head Spa.png")} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Jills Head Spa</Text>
              <Text style={styles.cardSubtitle}>📍 14 Farrer Park, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.2 (40)</Text>
              <Text style={styles.cardServices}>Head Massage • Scalp Treatment • Relaxation</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>7.0 km</Text>
              <Text style={styles.price}>From $65</Text>
            </View>
          </TouchableOpacity>

          {/* Additional Wellness Centers */}
          <TouchableOpacity style={styles.card}>
            <View style={styles.placeholderImage}>
              <Ionicons name="leaf" size={30} color="#34495E" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Zen Wellness Center</Text>
              <Text style={styles.cardSubtitle}>📍 Marina Bay, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.6 (156)</Text>
              <Text style={styles.cardServices}>Yoga • Meditation • Wellness Coaching</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>8.2 km</Text>
              <Text style={styles.price}>From $55</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

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
    zIndex: -1,
  },
  decorativeBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  // Bubbles with 60-70% opacity - Nature colors
  bubble: {
    position: 'absolute',
    borderRadius: 1000,
  },
  bubble1: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(46, 139, 87, 0.6)', // Sea green bubble - 60% opacity
    top: 130,
    right: 45,
  },
  bubble2: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(60, 179, 113, 0.65)', // Medium sea green bubble - 65% opacity
    top: 340,
    left: 70,
  },
  bubble3: {
    width: 26,
    height: 26,
    backgroundColor: 'rgba(102, 205, 170, 0.7)', // Medium aquamarine bubble - 70% opacity
    bottom: 220,
    right: 80,
  },
  bubble4: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(144, 238, 144, 0.65)', // Light green bubble - 65% opacity
    top: 460,
    left: 55,
  },
  bubble5: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(152, 251, 152, 0.7)', // Pale green bubble - 70% opacity
    bottom: 160,
    left: 120,
  },
  // Geometric shapes - Nature/Wellness themed
  geometric: {
    position: 'absolute',
  },
  leaf1: {
    width: 40,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(34, 139, 34, 0.6)', // Forest green leaf - 60% opacity
    transform: [{ rotate: '45deg' }],
    top: 220,
    right: 60,
  },
  leaf2: {
    width: 35,
    height: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(50, 205, 50, 0.65)', // Lime green leaf - 65% opacity
    transform: [{ rotate: '-30deg' }],
    bottom: 300,
    right: 40,
  },
  circle1: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: 'rgba(72, 209, 204, 0.7)', // Medium turquoise circle - 70% opacity
    top: 280,
    left: 40,
  },
  wave1: {
    width: 80,
    height: 25,
    borderRadius: 40,
    backgroundColor: 'rgba(175, 238, 238, 0.65)', // Pale turquoise wave - 65% opacity
    transform: [{ rotate: '20deg' }],
    bottom: 380,
    left: 90,
  },
  oval1: {
    width: 50,
    height: 30,
    borderRadius: 25,
    backgroundColor: 'rgba(127, 255, 212, 0.6)', // Aquamarine oval - 60% opacity
    transform: [{ rotate: '-15deg' }],
    top: 400,
    right: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#F7FBFE",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#34495E",
    flex: 1,
    textAlign: "center",
  },
  notificationButton: {
    backgroundColor: "#34495E",
    borderRadius: 20,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#34495E",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  businessSection: {
    paddingHorizontal: 20,
  },
  businessTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#34495E",
    marginBottom: 15,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#EEF3F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#34495E",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  cardRating: {
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
  },
  cardServices: {
    fontSize: 11,
    color: "#888",
    fontStyle: "italic",
  },
  cardRight: {
    alignItems: "flex-end",
  },
  distance: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    fontWeight: "600",
    color: "#34495E",
  },
});

export default WellnessScreen;