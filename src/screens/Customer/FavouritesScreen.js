import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomerBottomNav from '../../../components/CustomerBottomNav';
import { auth, db } from '../../firebase';

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

export default function FavouritesScreen({ navigation }) {
  const [favourites, setFavourites] = useState([]);
  const [realProfiles, setRealProfiles] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const favRef = collection(db, 'users', user.uid, 'favourites');
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      setFavourites(snapshot.docs.map(doc => doc.id));
    });
    return unsubscribe;
  }, [auth.currentUser]);

  // Fetch all real business profiles from Firestore (all categories)
  useEffect(() => {
    const fetchProfiles = async () => {
      const q = query(collection(db, 'businessProfiles'));
      const snap = await getDocs(q);
      setRealProfiles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProfiles();
  }, []);

  const handleBusinessPress = (business) => {
    navigation.navigate('BusinessProfile', { business });
  };

  // Merge static and Firestore businesses for favourites
  const favouriteBusinesses = [
    ...businessData.filter(b => favourites.includes(String(b.id))),
    ...realProfiles.filter(p => favourites.includes(String(p.id)) && !businessData.some(b => String(b.id) === String(p.id)))
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90, marginTop: 32 }}>
        <Text style={styles.title}>Your Favourites</Text>
        <Text style={styles.description}>Businesses you have saved for quick access. Tap the heart again to remove from favourites.</Text>
        {favouriteBusinesses.length === 0 ? (
          <Text style={styles.emptyMessage}>You have not added any favourites yet. Tap the heart icon on a business card to save it here!</Text>
        ) : (
          favouriteBusinesses.map((business) => (
            <View key={business.id} style={styles.businessCardWrapper}>
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                marginBottom: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.07,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <Text style={{ fontWeight: '700', fontSize: 16, color: '#34495E', marginBottom: 2 }}>
                  {business.name}
                </Text>
                <Text style={{ fontSize: 13, color: '#666' }}>
                  {business.description ? business.description.replace(/^[^a-zA-Z0-9]*/g, '').split(/[.!?]/)[0] : ''}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <CustomerBottomNav navigation={navigation} active="Favourites" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0a2540',
    marginTop: 30,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 18,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  emptyMessage: {
    fontSize: 15,
    color: '#BDC3C7',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 16,
  },
  businessCardWrapper: {
    marginBottom: 10,
  },
});
