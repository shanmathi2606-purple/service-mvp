// src/screens/FoodDiningScreen.js
import { LinearGradient } from 'expo-linear-gradient';
import { Bell } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomerBottomNav from '../../../components/CustomerBottomNav';

const FoodDiningScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Gradient Background - Warm Food Colors */}
      <LinearGradient
        colors={['#FFFEF7', '#FFF8DC', '#FFE4B5', '#FFEAA7']}
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
        <View style={[styles.geometric, styles.circle1]} />
        <View style={[styles.geometric, styles.circle2]} />
        <View style={[styles.geometric, styles.star1]} />
        <View style={[styles.geometric, styles.oval1]} />
        <View style={[styles.geometric, styles.pentagon1]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food & Dining</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={18} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Search and Filter Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Discover Great Food & Dining</Text>
          <Text style={styles.sectionSubtitle}>From casual dining to fine restaurants</Text>
        </View>

        {/* Food Business Cards */}
        <View style={styles.businessSection}>
          <Text style={styles.businessTitle}>Popular Restaurants</Text>
          
          {/* Ram's Indian Dining */}
          <TouchableOpacity style={styles.card}>
            <Image source={require("../../../assets/images/RamsIndianDining.png")} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Ram's Indian Dining</Text>
              <Text style={styles.cardSubtitle}>📍 15 Thomson Park, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.7 (63)</Text>
              <Text style={styles.cardServices}>Indian Cuisine • Private Dining • Vegetarian Options</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>11.0 km</Text>
              <Text style={styles.price}>$25-40</Text>
            </View>
          </TouchableOpacity>

          {/* Additional Restaurant Examples */}
          <TouchableOpacity style={styles.card}>
            <View style={styles.placeholderImage}>
              {/* Add Lucide restaurant icon if needed */}
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Golden Dragon Chinese</Text>
              <Text style={styles.cardSubtitle}>📍 Chinatown, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.4 (89)</Text>
              <Text style={styles.cardServices}>Chinese Cuisine • Dim Sum • Family Style</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>5.2 km</Text>
              <Text style={styles.price}>$20-35</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.placeholderImage}>
              {/* Add Lucide pizza icon if needed */}
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Bella Italia</Text>
              <Text style={styles.cardSubtitle}>📍 Clarke Quay, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.5 (124)</Text>
              <Text style={styles.cardServices}>Italian Cuisine • Pizza • Pasta • Wine</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>7.8 km</Text>
              <Text style={styles.price}>$30-50</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.placeholderImage}>
              {/* Add Lucide fish icon if needed */}
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Ocean Fresh Seafood</Text>
              <Text style={styles.cardSubtitle}>📍 East Coast, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.3 (76)</Text>
              <Text style={styles.cardServices}>Seafood • Fresh Fish • Outdoor Seating</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>12.1 km</Text>
              <Text style={styles.price}>$35-60</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomerBottomNav navigation={navigation} active="FoodDining" />
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
  // Bubbles with 60-70% opacity - Food colors
  bubble: {
    position: 'absolute',
    borderRadius: 1000,
  },
  bubble1: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(255, 140, 0, 0.6)', // Orange bubble - 60% opacity
    top: 120,
    right: 40,
  },
  bubble2: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.65)', // Gold bubble - 65% opacity
    top: 350,
    left: 60,
  },
  bubble3: {
    width: 25,
    height: 25,
    backgroundColor: 'rgba(255, 99, 71, 0.7)', // Tomato bubble - 70% opacity
    bottom: 200,
    right: 70,
  },
  bubble4: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 228, 181, 0.65)', // Moccasin bubble - 65% opacity
    top: 450,
    right: 30,
  },
  bubble5: {
    width: 35,
    height: 35,
    backgroundColor: 'rgba(255, 218, 185, 0.7)', // Peach bubble - 70% opacity
    bottom: 300,
    left: 40,
  },
  // Geometric shapes - Food themed
  geometric: {
    position: 'absolute',
  },
  circle1: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 165, 0, 0.6)', // Orange circle - 60% opacity
    top: 250,
    left: 30,
  },
  circle2: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 200, 124, 0.65)', // Light orange circle - 65% opacity
    bottom: 150,
    right: 100,
  },
  star1: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255, 215, 0, 0.7)', // Gold star - 70% opacity
    top: 180,
    left: 100,
  },
  oval1: {
    width: 60,
    height: 30,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 228, 196, 0.65)', // Bisque oval - 65% opacity
    transform: [{ rotate: '25deg' }],
    bottom: 400,
    left: 80,
  },
  pentagon1: {
    width: 25,
    height: 25,
    backgroundColor: 'rgba(255, 160, 122, 0.6)', // Light salmon pentagon - 60% opacity
    transform: [{ rotate: '30deg' }],
    top: 380,
    right: 120,
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

export default FoodDiningScreen;