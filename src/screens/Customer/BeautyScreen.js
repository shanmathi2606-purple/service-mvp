// src/screens/BeautyScreen.js
import { LinearGradient } from 'expo-linear-gradient';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { Bell, Flower, Scissors, Sparkles } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CustomerBottomNav from '../../../components/CustomerBottomNav';
import { auth, db } from '../../firebase';

const BeautyScreen = ({ navigation }) => {
  const [businesses, setBusinesses] = useState([]);
  const [realProfiles, setRealProfiles] = useState([]);
  const [favourites, setFavourites] = useState([]);
  // Listen to user's favourites in Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const favRef = collection(db, "users", user.uid, "favourites");
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      setFavourites(snapshot.docs.map(doc => doc.id));
    });
    return unsubscribe;
  }, [auth.currentUser]);

  // Toggle favourite in Firestore
  const handleToggleFavourite = async (profile) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Please log in", "You must be logged in to save favourites.");
      return;
    }
    const favRef = doc(db, "users", user.uid, "favourites", String(profile.id));
    if (favourites.includes(String(profile.id))) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, { businessId: profile.id, addedAt: new Date() });
    }
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      const q = query(collection('businesses', 'beauty'));
      const querySnapshot = await getDocs(q);
      const businesses = querySnapshot.docs.map(doc => doc.data());
      setBusinesses(businesses);
    };
    fetchBusinesses();
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      const q = query(collection(db, 'businessProfiles'), where('category', '==', 'Beauty'));
      const snap = await getDocs(q);
      setRealProfiles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProfiles();
  }, []);

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#FFFFFF', '#FAF0FA', '#F8F4FF', '#F0F8FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />
      
      {/* Decorative Background Elements */}
      <View style={styles.decorativeBackground}>
        {/* Original Decorative Elements */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
        <View style={[styles.wave, styles.wave1]} />
        <View style={[styles.wave, styles.wave2]} />
        
        {/* New Bubbles and Geometric Elements */}
        <View style={[styles.bubble, styles.bubble1]} />
        <View style={[styles.bubble, styles.bubble2]} />
        <View style={[styles.bubble, styles.bubble3]} />
        <View style={[styles.bubble, styles.bubble4]} />
        <View style={[styles.bubble, styles.bubble5]} />
        <View style={[styles.geometric, styles.triangle1]} />
        <View style={[styles.geometric, styles.triangle2]} />
        <View style={[styles.geometric, styles.hexagon1]} />
        <View style={[styles.geometric, styles.diamond1]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Beauty Services</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={18} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Search and Filter Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Find Beauty Services Near You</Text>
          <Text style={styles.sectionSubtitle}>Discover the best beauty salons and services</Text>
        </View>

        {/* Real Business Profiles from Firestore */}
        {realProfiles.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.businessTitle}>   Live Beauty Businesses</Text>
            {realProfiles.map(profile => (
              <TouchableOpacity
                key={profile.id}
                style={styles.card}
                onPress={() => navigation.navigate('BusinessProfile', { business: profile })}
                activeOpacity={0.9}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{profile.name}</Text>
                  <Text style={styles.cardSubtitle}>{profile.description}</Text>
                  <Text style={styles.cardServices}>{Array.isArray(profile.menu) ? profile.menu.map(s => s.name).join(' • ') : ''}</Text>
                </View>
                <View style={styles.cardRight}>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation && e.stopPropagation();
                      handleToggleFavourite(profile);
                    }}
                    style={{ padding: 4 }}
                  >
                    <Feather
                      name={favourites.includes(String(profile.id)) ? 'heart' : 'heart'}
                      size={22}
                      color={favourites.includes(String(profile.id)) ? '#e11d48' : '#bbb'}
                      solid={favourites.includes(String(profile.id))}
                    />
                  </TouchableOpacity>
                  <Text style={styles.price}>Menu</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Beauty Business Cards */}
        <View style={styles.businessSection}>
          <Text style={styles.businessTitle}>Popular Beauty Services</Text>
          
          {/* Lashes by Mi */}
          <TouchableOpacity style={styles.card}>
            <Image source={require("../../../assets/images/lashes.png")} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Lashes by Mi</Text>
              <Text style={styles.cardSubtitle}>📍 Serangoon, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.7 (60)</Text>
              <Text style={styles.cardServices}>Eyelash Extensions • Lash Lift • Brow Shaping</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>2 km</Text>
              <Text style={styles.price}>From $45</Text>
            </View>
          </TouchableOpacity>

          {/* Nails X Bar */}
          <TouchableOpacity style={styles.card}>
            <Image source={require("../../../assets/images/nails.png")} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Nails X Bar</Text>
              <Text style={styles.cardSubtitle}>📍 Hougang, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.5 (93)</Text>
              <Text style={styles.cardServices}>Manicure • Pedicure • Nail Art • Gel Polish</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>3.5 km</Text>
              <Text style={styles.price}>From $25</Text>
            </View>
          </TouchableOpacity>

          {/* Beauty Salon Example 1 */}
          <TouchableOpacity style={styles.card}>
            <View style={styles.placeholderImage}>
              <Scissors size={32} color="#C084FC" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Glam Studio</Text>
              <Text style={styles.cardSubtitle}>📍 Orchard, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.5 (89)</Text>
              <Text style={styles.cardServices}>Hair Cut • Hair Color • Styling</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>3.2 km</Text>
              <Text style={styles.price}>From $60</Text>
            </View>
          </TouchableOpacity>

          {/* Beauty Salon Example 2 */}
          <TouchableOpacity style={styles.card}>
            <View style={styles.placeholderImage}>
              <Sparkles size={32} color="#F472B6" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Radiant Beauty</Text>
              <Text style={styles.cardSubtitle}>📍 Tampines, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.6 (124)</Text>
              <Text style={styles.cardServices}>Facial • Manicure • Pedicure</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>4.1 km</Text>
              <Text style={styles.price}>From $35</Text>
            </View>
          </TouchableOpacity>

          {/* Beauty Salon Example 3 */}
          <TouchableOpacity style={styles.card}>
            <View style={styles.placeholderImage}>
              <Flower size={32} color="#FBBF24" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Blossom Beauty Bar</Text>
              <Text style={styles.cardSubtitle}>📍 Jurong East, Singapore</Text>
              <Text style={styles.cardRating}>⭐ 4.3 (67)</Text>
              <Text style={styles.cardServices}>Eyebrow Threading • Makeup • Waxing</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.distance}>5.8 km</Text>
              <Text style={styles.price}>From $25</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomerBottomNav navigation={navigation} active="Beauty" />
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
  circle: {
    position: 'absolute',
    borderRadius: 1000,
  },
  circle1: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 192, 203, 0.1)', // Light pink
    top: 100,
    right: -30,
  },
  circle2: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(221, 160, 221, 0.08)', // Light purple
    bottom: 200,
    left: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(173, 216, 230, 0.12)', // Light blue
    top: 300,
    left: 50,
  },
  wave: {
    position: 'absolute',
    borderRadius: 50,
  },
  wave1: {
    width: 200,
    height: 40,
    backgroundColor: 'rgba(255, 182, 193, 0.06)', // Light pink wave
    transform: [{ rotate: '15deg' }],
    top: 250,
    right: -50,
  },
  wave2: {
    width: 150,
    height: 30,
    backgroundColor: 'rgba(230, 230, 250, 0.08)', // Lavender wave
    transform: [{ rotate: '-20deg' }],
    bottom: 150,
    left: -30,
  },
  // Bubbles with 60-70% opacity
  bubble: {
    position: 'absolute',
    borderRadius: 1000,
  },
  bubble1: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 192, 203, 0.6)', // Pink bubble - 60% opacity
    top: 150,
    left: 30,
  },
  bubble2: {
    width: 25,
    height: 25,
    backgroundColor: 'rgba(221, 160, 221, 0.65)', // Purple bubble - 65% opacity
    top: 400,
    right: 80,
  },
  bubble3: {
    width: 35,
    height: 35,
    backgroundColor: 'rgba(173, 216, 230, 0.7)', // Blue bubble - 70% opacity
    bottom: 300,
    right: 50,
  },
  bubble4: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(250, 240, 250, 0.65)', // Light pink - 65% opacity
    top: 500,
    left: 80,
  },
  bubble5: {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(248, 244, 255, 0.7)', // Light purple - 70% opacity
    bottom: 100,
    left: 150,
  },
  // Geometric shapes
  geometric: {
    position: 'absolute',
  },
  triangle1: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255, 182, 193, 0.6)', // Pink triangle - 60% opacity
    top: 200,
    right: 100,
  },
  triangle2: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(230, 230, 250, 0.65)', // Lavender triangle - 65% opacity
    bottom: 250,
    left: 100,
  },
  hexagon1: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(240, 248, 255, 0.7)', // Light blue hexagon - 70% opacity
    transform: [{ rotate: '45deg' }],
    top: 350,
    right: 30,
  },
  diamond1: {
    width: 25,
    height: 25,
    backgroundColor: 'rgba(255, 240, 245, 0.65)', // Light rose - 65% opacity
    transform: [{ rotate: '45deg' }],
    bottom: 400,
    right: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "rgba(247, 251, 254, 0.95)",
    zIndex: 1,
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
    zIndex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 192, 203, 0.1)",
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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 0.5,
    borderColor: "rgba(221, 160, 221, 0.15)",
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

export default BeautyScreen;