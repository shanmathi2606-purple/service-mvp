// src/screens/FreelanceScreen.js
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Brush, Camera, FileText, Laptop, Music } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomerBottomNav from '../../../components/CustomerBottomNav';

const FreelanceScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Gradient Background - Professional Tech Colors */}
      <LinearGradient
        colors={['#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA']}
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
        <View style={[styles.geometric, styles.square1]} />
        <View style={[styles.geometric, styles.rectangle1]} />
        <View style={[styles.geometric, styles.triangle1]} />
        <View style={[styles.geometric, styles.diamond1]} />
        <View style={[styles.geometric, styles.hexagon1]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Freelance Services</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={18} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Search and Filter Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Professional Freelance Services</Text>
          <Text style={styles.sectionSubtitle}>Connect with skilled freelancers for your projects</Text>
        </View>

        {/* Freelance Business Cards */}
        <View style={styles.businessSection}>
          <Text style={styles.businessTitle}>Popular Freelancers</Text>
          
          {/* Freelancer Examples */}
          <TouchableOpacity style={styles.card}>
            <View style={styles.placeholderImage}>
              <Laptop size={30} color="#34495E" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Alex Web Developer</Text>
              <Text style={styles.cardSubtitle}>📍 Remote / Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.9 (45)</Text>
              <Text style={styles.cardServices}>Web Development • React • Node.js</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>Remote</Text>
              <Text style={styles.price}>$50/hr</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.placeholderImage}>
              <Camera size={30} color="#34495E" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Sarah Photography</Text>
              <Text style={styles.cardSubtitle}>📍 Central Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.8 (89)</Text>
              <Text style={styles.cardServices}>Event Photography • Portraits • Weddings</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>2.5 km</Text>
              <Text style={styles.price}>$80/hr</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.placeholderImage}>
              <Brush size={30} color="#34495E" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Mike Graphic Designer</Text>
              <Text style={styles.cardSubtitle}>📍 Creative Hub, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.7 (67)</Text>
              <Text style={styles.cardServices}>Logo Design • Branding • UI/UX</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>4.2 km</Text>
              <Text style={styles.price}>$45/hr</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.placeholderImage}>
              <FileText size={30} color="#34495E" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Emma Content Writer</Text>
              <Text style={styles.cardSubtitle}>📍 Remote / Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.6 (123)</Text>
              <Text style={styles.cardServices}>Content Writing • SEO • Copywriting</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>Remote</Text>
              <Text style={styles.price}>$35/hr</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.placeholderImage}>
              <Music size={30} color="#34495E" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>David Music Producer</Text>
              <Text style={styles.cardSubtitle}>📍 Music District, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.5 (34)</Text>
              <Text style={styles.cardServices}>Music Production • Audio Mixing • Jingles</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>6.8 km</Text>
              <Text style={styles.price}>$60/hr</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomerBottomNav navigation={navigation} active="Freelance" />
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
  // Bubbles with 60-70% opacity - Professional colors
  bubble: {
    position: 'absolute',
    borderRadius: 1000,
  },
  bubble1: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(52, 73, 94, 0.6)', // Steel blue bubble - 60% opacity
    top: 140,
    left: 50,
  },
  bubble2: {
    width: 35,
    height: 35,
    backgroundColor: 'rgba(108, 117, 125, 0.65)', // Gray bubble - 65% opacity
    top: 320,
    right: 60,
  },
  bubble3: {
    width: 28,
    height: 28,
    backgroundColor: 'rgba(73, 80, 87, 0.7)', // Dark gray bubble - 70% opacity
    bottom: 250,
    left: 80,
  },
  bubble4: {
    width: 42,
    height: 42,
    backgroundColor: 'rgba(134, 142, 150, 0.65)', // Medium gray bubble - 65% opacity
    top: 480,
    right: 40,
  },
  bubble5: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(173, 181, 189, 0.7)', // Light gray bubble - 70% opacity
    bottom: 180,
    right: 90,
  },
  // Geometric shapes - Professional/Tech themed
  geometric: {
    position: 'absolute',
  },
  square1: {
    width: 35,
    height: 35,
    backgroundColor: 'rgba(52, 58, 64, 0.6)', // Dark square - 60% opacity
    top: 200,
    right: 30,
  },
  rectangle1: {
    width: 50,
    height: 25,
    backgroundColor: 'rgba(108, 117, 125, 0.65)', // Gray rectangle - 65% opacity
    transform: [{ rotate: '15deg' }],
    bottom: 320,
    left: 40,
  },
  triangle1: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(134, 142, 150, 0.7)', // Medium gray triangle - 70% opacity
    top: 380,
    left: 120,
  },
  diamond1: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(73, 80, 87, 0.65)', // Dark gray diamond - 65% opacity
    transform: [{ rotate: '45deg' }],
    bottom: 400,
    right: 50,
  },
  hexagon1: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(173, 181, 189, 0.6)', // Light gray hexagon - 60% opacity
    transform: [{ rotate: '30deg' }],
    top: 280,
    left: 150,
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

export default FreelanceScreen;