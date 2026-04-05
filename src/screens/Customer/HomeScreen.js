// src/screens/HomeScreen.js
// Removed unused Ionicons import
import * as Location from 'expo-location';
import { signOut } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import CustomerBottomNav from '../../../components/CustomerBottomNav';
import BusinessCard from "../../components/BusinessCard";
import { auth, db } from "../../firebase";

const HomeScreen = ({ navigation }) => {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
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

  useEffect(() => {
    if (locationEnabled) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationEnabled(false);
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setUserLocation(loc.coords);
        // Reverse geocode to get area name
        let placemarks = await Location.reverseGeocodeAsync(loc.coords);
        if (placemarks && placemarks.length > 0) {
          setUserLocation((prev) => ({ ...prev, area: placemarks[0].suburb || placemarks[0].district || placemarks[0].city || placemarks[0].region || placemarks[0].name }));
        }
      })();
    }
  }, [locationEnabled]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  // Business data with comprehensive information
  const businessData = [
    {
      id: 1,
      name: "Lashes by Mi",
      category: "Beauty & Wellness",
      location: "Serangoon, Singapore",
      distance: "2 km",
      rating: "4.7",
      reviews: "60",
      image: require("../../../assets/images/lashes.png"),
      description: "Experience luxury lash extensions and beauty treatments in the heart of Serangoon. Our expert technicians use premium products to enhance your natural beauty with precision and care.",
      services: [
        { name: "Classic Lash Extensions", price: "$80" },
        { name: "Volume Lash Extensions", price: "$120" },
        { name: "Lash Lift & Tint", price: "$60" },
        { name: "Eyebrow Shaping", price: "$35" },
        { name: "Facial Treatment", price: "$90" }
      ],
      hours: [
        { day: "Monday", time: "9:00 AM - 7:00 PM" },
        { day: "Tuesday", time: "9:00 AM - 7:00 PM" },
        { day: "Wednesday", time: "9:00 AM - 7:00 PM" },
        { day: "Thursday", time: "9:00 AM - 8:00 PM" },
        { day: "Friday", time: "9:00 AM - 8:00 PM" },
        { day: "Saturday", time: "8:00 AM - 6:00 PM" },
        { day: "Sunday", time: "Closed" }
      ],
      phone: "+65 8123 4567",
      email: "hello@lashesbymi.sg",
      website: "www.lashesbymi.sg"
    },
    {
      id: 2,
      name: "Nails X Bar",
      category: "Beauty & Nail Care",
      location: "Hougang, Singapore",
      distance: "3.5 km",
      rating: "4.5",
      reviews: "93",
      image: require("../../../assets/images/nails.png"),
      description: "Trendy nail salon offering the latest in nail art, manicures, and pedicures. Our skilled nail technicians create stunning designs using high-quality products in a relaxing atmosphere.",
      services: [
        { name: "Classic Manicure", price: "$25" },
        { name: "Gel Manicure", price: "$45" },
        { name: "Nail Art Design", price: "$15" },
        { name: "Pedicure", price: "$35" },
        { name: "French Manicure", price: "$30" }
      ],
      hours: [
        { day: "Monday", time: "10:00 AM - 8:00 PM" },
        { day: "Tuesday", time: "10:00 AM - 8:00 PM" },
        { day: "Wednesday", time: "10:00 AM - 8:00 PM" },
        { day: "Thursday", time: "10:00 AM - 9:00 PM" },
        { day: "Friday", time: "10:00 AM - 9:00 PM" },
        { day: "Saturday", time: "9:00 AM - 7:00 PM" },
        { day: "Sunday", time: "11:00 AM - 6:00 PM" }
      ],
      phone: "+65 9234 5678",
      email: "bookings@nailsxbar.sg",
      website: "www.nailsxbar.sg"
    },
    {
      id: 3,
      name: "Haily Home Spa",
      category: "Wellness & Spa",
      location: "Farrer Park, Singapore",
      distance: "6.7 km",
      rating: "4.1",
      reviews: "28",
      image: require("../../../assets/images/Haily Home Spa.png"),
      description: "Escape to tranquility at our boutique spa. We offer personalized wellness treatments including massages, facials, and holistic therapies to rejuvenate your mind and body.",
      services: [
        { name: "Swedish Massage", price: "$80" },
        { name: "Deep Tissue Massage", price: "$100" },
        { name: "Aromatherapy Facial", price: "$75" },
        { name: "Hot Stone Therapy", price: "$120" },
        { name: "Couples Massage", price: "$180" }
      ],
      hours: [
        { day: "Monday", time: "10:00 AM - 9:00 PM" },
        { day: "Tuesday", time: "10:00 AM - 9:00 PM" },
        { day: "Wednesday", time: "10:00 AM - 9:00 PM" },
        { day: "Thursday", time: "10:00 AM - 9:00 PM" },
        { day: "Friday", time: "10:00 AM - 10:00 PM" },
        { day: "Saturday", time: "9:00 AM - 10:00 PM" },
        { day: "Sunday", time: "9:00 AM - 8:00 PM" }
      ],
      phone: "+65 8345 6789",
      email: "relax@hailyhomespa.sg",
      website: "www.hailyhomespa.sg"
    },
    {
      id: 4,
      name: "Jills Head Spa",
      category: "Wellness & Hair Care",
      location: "14 Farrer Park, Singapore",
      distance: "7.0 km",
      rating: "4.2",
      reviews: "40",
      image: require("../../../assets/images/Jills Head Spa.png"),
      description: "Specialized head spa treatments combining traditional techniques with modern wellness practices. Experience ultimate relaxation with our signature scalp massages and hair treatments.",
      services: [
        { name: "Signature Head Massage", price: "$65" },
        { name: "Scalp Treatment", price: "$85" },
        { name: "Hair Steam Therapy", price: "$55" },
        { name: "Anti-Dandruff Treatment", price: "$70" },
        { name: "Relaxation Package", price: "$110" }
      ],
      hours: [
        { day: "Monday", time: "11:00 AM - 8:00 PM" },
        { day: "Tuesday", time: "11:00 AM - 8:00 PM" },
        { day: "Wednesday", time: "Closed" },
        { day: "Thursday", time: "11:00 AM - 8:00 PM" },
        { day: "Friday", time: "11:00 AM - 9:00 PM" },
        { day: "Saturday", time: "10:00 AM - 8:00 PM" },
        { day: "Sunday", time: "10:00 AM - 7:00 PM" }
      ],
      phone: "+65 9456 7890",
      email: "info@jillsheadspa.sg",
      website: "www.jillsheadspa.sg"
    },
    {
      id: 5,
      name: "Ram's Indian Dining",
      category: "Food & Dining",
      location: "15 Thomson Park, Singapore",
      distance: "11.0 km",
      rating: "4.7",
      reviews: "63",
      image: require("../../../assets/images/RamsIndianDining.png"),
      description: "Authentic Indian cuisine prepared with traditional spices and recipes passed down through generations. Experience the rich flavors of India in our cozy, family-friendly restaurant.",
      services: [
        { name: "Tandoori Chicken", price: "$18" },
        { name: "Butter Chicken", price: "$16" },
        { name: "Biryani Special", price: "$14" },
        { name: "Vegetarian Thali", price: "$12" },
        { name: "Masala Dosa", price: "$8" }
      ],
      hours: [
        { day: "Monday", time: "11:30 AM - 3:00 PM, 6:00 PM - 10:00 PM" },
        { day: "Tuesday", time: "11:30 AM - 3:00 PM, 6:00 PM - 10:00 PM" },
        { day: "Wednesday", time: "11:30 AM - 3:00 PM, 6:00 PM - 10:00 PM" },
        { day: "Thursday", time: "11:30 AM - 3:00 PM, 6:00 PM - 10:00 PM" },
        { day: "Friday", time: "11:30 AM - 3:00 PM, 6:00 PM - 10:30 PM" },
        { day: "Saturday", time: "11:30 AM - 10:30 PM" },
        { day: "Sunday", time: "11:30 AM - 10:00 PM" }
      ],
      phone: "+65 8567 8901",
      email: "orders@ramsindiandining.sg",
      website: "www.ramsindiandining.sg"
    }
  ];

  const handleBusinessPress = (business) => {
    navigation.navigate("BusinessProfile", { business });
  };

  // Toggle favourite in Firestore
  const handleToggleFavourite = async (business) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Please log in", "You must be logged in to save favourites.");
      return;
    }
    const favRef = doc(db, "users", user.uid, "favourites", String(business.id));
    if (favourites.includes(String(business.id))) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, { businessId: business.id, addedAt: new Date() });
    }
  };

  return (
    <View style={styles.container}>
      {/* Remove Gradient Background for seamless white look */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 90}}>
        {/* Header */}
        <View style={styles.headerBackground}>
          <View style={styles.topBarRowExpanded}>
            <TouchableOpacity style={styles.topBarButton} onPress={handleLogout}>
              <View style={styles.topBarIconCircle}>
                <Feather name="log-out" size={22} color="#0a2540" />
              </View>
            </TouchableOpacity>
            <View style={styles.topBarSearchContainer}>
              <TextInput
                placeholder="Search services, salons, or more..."
                placeholderTextColor="#999"
                style={styles.topBarSearchInput}
              />
            </View>
            <TouchableOpacity style={styles.topBarButton} onPress={() => navigation.navigate("Favourites")}> 
              <View style={styles.topBarIconCircle}>
                <View style={styles.topBarIconGoldOutline}>
                  <Image source={require("../../../assets/images/heart.png")} style={styles.topBarIconVisible} resizeMode="contain" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search services, salons, or more..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>
        {/* Category Icons */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryRow}>
            <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate("Beauty")}> 
              <Image source={require("../../../assets/images/Beauty.png")} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Beauty</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate("Wellness")}> 
              <Image source={require("../../../assets/images/Wellness.png")} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Wellness</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryRow}>
            <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate("FoodDining")}> 
              <Image source={require("../../../assets/images/FoodDining.png")} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Food & Dining</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate("Freelance")}> 
              <Image source={require("../../../assets/images/Freelance.png")} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Freelance</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Find Nearby Section */}
        <View style={styles.findNearbyRow}>
          <TouchableOpacity onPress={() => setLocationEnabled((v) => !v)}>
            <Text style={[styles.findNearby, locationEnabled && { color: '#2ecc40' }]}>Find Nearby {locationEnabled ? '(On)' : '(Off)'}</Text>
          </TouchableOpacity>
          <Text style={styles.viewMap}>📍 View on Map</Text>
        </View>
        {locationEnabled && userLocation && (
          <View style={{ padding: 10, alignItems: 'center' }}>
            <Text style={{ color: '#34495E', fontSize: 12 }}>
              Your location: {userLocation.area ? userLocation.area + ' • ' : ''}{userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </Text>
          </View>
        )}
        {/* Business Cards - Now Using Reusable Component */}
        {businessData.map((business) => (
          <View key={business.id} style={styles.businessCardWrapper}>
            <BusinessCard
              business={business}
              onPress={handleBusinessPress}
              isFavourited={favourites.includes(String(business.id))}
              onToggleFavourite={handleToggleFavourite}
            />
          </View>
        ))}
      </ScrollView>
      {/* Bottom Navigation */}
      <CustomerBottomNav navigation={navigation} active="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Clean white background
    paddingTop: 0, // Remove extra padding
  },
  headerBackground: {
    backgroundColor: '#0a2540', // Dark navy blue with a hint of cyan
    height: 100, // Increased from 70 to 100 for a taller top bar
    width: '100%',
    justifyContent: 'center',
    marginHorizontal: 0,
    marginBottom: 0,
    paddingVertical: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    paddingTop: 0, // Remove extra padding
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    marginTop: 50,
    paddingTop: 10,
  },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#EEF3F7",
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 10,
  },
  logoutText: {
    color: "#34495E",
    fontSize: 12,
    fontWeight: "600",
  },
  headerText: {
    color: "#34495E",
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 60,
    marginTop: 20,
  },
  notificationButton: {
    backgroundColor: "#34495E",
    borderRadius: 20,
    padding: 8,
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  searchContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  searchInput: {
    backgroundColor: "#EEF3F7",
    width: "90%",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  categoryContainer: {
    width: "90%",
    alignSelf: "center",
    marginTop: 25,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  categoryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "47%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#EEF3F7",
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#34495E",
    textAlign: "center",
  },
  findNearbyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
  },
  findNearby: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  viewMap: {
    fontSize: 14,
    color: "#34495E",
  },

  topBarRowExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: 12,
    width: '100%',
    gap: 8,
    paddingTop: 18, // Add top padding for visibility
  },
  topBarSearchContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  topBarSearchInput: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#222',
    width: '100%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },

  topBarButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  topBarButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  topBarWelcomeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  topBarIcon: {
    width: 24,
    height: 20,
    tintColor: '#fff',
  },
  topBarIconCircle: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  topBarIconGoldOutline: {
    borderWidth: 2.5,
    borderColor: '#FFD700', // Bolder Gold
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  topBarIconVisible: {
    width: 26,
    height: 24,
    // Remove tintColor to preserve original heart color
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#34495E",
    height: 70,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  navItem: {
    color: "#fff",
    fontSize: 9,
    textAlign: "center",
    marginTop: 2,
  },
  navIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
});

export default HomeScreen;
