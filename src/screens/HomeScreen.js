// src/screens/HomeScreen.js
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Hi Shan,{"\n"}Welcome back👋
          </Text>
          <Image
            source={require("../../assets/images/notification.png")}
            style={styles.notificationIcon}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search services, salons, or more..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <TouchableOpacity style={styles.categoryBox}>
            <Image source={require("../../assets/images/Beauty.png")} style={styles.categoryIcon} />
            <Text style={styles.categoryLabel}>BEAUTY</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryBox}>
            <Image source={require("../../assets/images/Wellness.png")} style={styles.categoryIcon} />
            <Text style={styles.categoryLabel}>WELLNESS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryBox}>
            <Image source={require("../../assets/images/Freelance.png")} style={styles.categoryIcon} />
            <Text style={styles.categoryLabel}>FREELANCE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryBox}>
            <Image source={require("../../assets/images/Food & Dining.png")} style={styles.categoryIcon} />
            <Text style={styles.categoryLabel}>FOOD & DINING</Text>
          </TouchableOpacity>
        </View>

        {/* Find Nearby Section */}
        <View style={styles.findNearbyRow}>
          <Text style={styles.findNearby}>Find Nearby</Text>
          <Text style={styles.viewMap}>📍 View on Map</Text>
        </View>

        {/* Business Cards */}
        <View style={styles.card}>
          <Image source={require("../../assets/images/lashses.png")} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Lashes by Mi</Text>
            <Text style={styles.cardSubtitle}>📍 Serangoon, Singapore</Text>
            <Text style={styles.cardRating}>⭐ 4.7 (60)</Text>
          </View>
          <Text style={styles.distance}>2 km</Text>
        </View>

        <View style={styles.card}>
          <Image source={require("../../assets/images/nails.png")} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Nails X Bar</Text>
            <Text style={styles.cardSubtitle}>📍 Hougang, Singapore</Text>
            <Text style={styles.cardRating}>⭐ 4.5 (93)</Text>
          </View>
          <Text style={styles.distance}>3.5 km</Text>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Text style={styles.navItem}>🏠 Home</Text>
        <Text style={styles.navItem}>📅 My Bookings</Text>
        <Text style={styles.navItem}>♡ Favourites</Text>
        <Text style={styles.navItem}>👤 Profile</Text>
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
    paddingHorizontal: 25,
    marginTop: 60,
  },
  headerText: {
    color: "#34495E",
    fontSize: 22,
    fontWeight: "700",
  },
  notificationIcon: {
    width: 25,
    height: 25,
    tintColor: "#666666ff",
    marginTop: 5,
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
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "80%",
    alignSelf: "center",
    marginTop: 25,
  },
  categoryBox: {
    backgroundColor: "#FFFFFF",
    width: "45%",
    height: "45%",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
  },
  categoryIcon: {
   alignItems: "center",
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
  },
  findNearbyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    marginTop: 25,
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
  navItem: {
    color: "#fff",
    fontSize: 11,
    textAlign: "center",
  },
});

export default HomeScreen;
