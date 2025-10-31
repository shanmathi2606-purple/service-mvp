// src/screens/HomeScreen.js
import { signOut } from "firebase/auth";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { auth } from "../firebase";

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>⬅ Logout</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>
            Hi Shan,{"\n"}Welcome back👋
          </Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={18} color="white" />
          </TouchableOpacity> 
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
              <Image source={require("../../assets/images/Beauty.png")} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Beauty</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate("Wellness")}>
              <Image source={require("../../assets/images/Wellness.png")} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Wellness</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryRow}>
            <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate("FoodDining")}>
              <Image source={require("../../assets/images/FoodDining.png")} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Food & Dining</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate("Freelance")}>
              <Image source={require("../../assets/images/Freelance.png")} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Freelance</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Find Nearby Section */}
        <View style={styles.findNearbyRow}>
          <Text style={styles.findNearby}>Find Nearby</Text>
          <Text style={styles.viewMap}>📍 View on Map</Text>
        </View>

        {/* Business Cards - Now Clickable */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Beauty")}>
          <Image source={require("../../assets/images/lashses.png")} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Lashes by Mi</Text>
            <Text style={styles.cardSubtitle}>📍 Serangoon, Singapore</Text>
            <Text style={styles.cardRating}>⭐ 4.7 (60)</Text>
          </View>
          <Text style={styles.distance}>2 km</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Beauty")}>
          <Image source={require("../../assets/images/nails.png")} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Nails X Bar</Text>
            <Text style={styles.cardSubtitle}>📍 Hougang, Singapore</Text>
            <Text style={styles.cardRating}>⭐ 4.5 (93)</Text>
          </View>
          <Text style={styles.distance}>3.5 km</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Wellness")}>
          <Image source={require("../../assets/images/Haily Home Spa.png")} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Haily Home Spa</Text>
            <Text style={styles.cardSubtitle}>📍 Farrer Park, Singapore</Text>
            <Text style={styles.cardRating}>⭐ 4.1 (28)</Text>
          </View>
          <Text style={styles.distance}>6.7 km</Text>
        </TouchableOpacity>
       
       <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Wellness")}>
          <Image source={require("../../assets/images/Jills Head Spa.png")} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Jills Head Spa</Text>
            <Text style={styles.cardSubtitle}>📍 14 Farrer Park, Singapore</Text>
            <Text style={styles.cardRating}>⭐ 4.2 (40)</Text>
          </View>
          <Text style={styles.distance}>7.0 km</Text>
        </TouchableOpacity>
       
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("FoodDining")}>
          <Image source={require("../../assets/images/Ram's Indian Dining.png")} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Ram's Indian Dining</Text>
            <Text style={styles.cardSubtitle}>📍 15 Thomson Park, Singapore</Text>
            <Text style={styles.cardRating}>⭐ 4.7 (63)</Text>
          </View>
          <Text style={styles.distance}>11.0 km</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require("../../assets/images/home.png")} style={styles.navIcon} />
          <Text style={styles.navItem}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("MyBookings")}>
          <Image source={require("../../assets/images/calendar.png")} style={styles.navIcon} />
          <Text style={styles.navItem}>My Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require("../../assets/images/heart.png")} style={styles.navIcon} />
          <Text style={styles.navItem}>Favourites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Profile")}>
          <Image source={require("../../assets/images/user.png")} style={styles.navIcon} />
          <Text style={styles.navItem}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FBFE",
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F6FA",
    borderRadius: 15,
    marginTop: 12,
    width: "90%",
    alignSelf: "center",
    padding: 12,
    elevation: 2,
  },
  cardImage: {
    width: 55,
    height: 55,
    borderRadius: 10,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#000",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#555",
  },
  cardRating: {
    fontSize: 12,
    color: "#333",
  },
  distance: {
    fontSize: 12,
    color: "#777",
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
