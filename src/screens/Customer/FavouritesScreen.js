import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomerBottomNav from '../../../components/CustomerBottomNav';
import BusinessCard from '../../components/BusinessCard';
import { auth, db } from '../../firebase';

const businessData = [
  // ... (copy the same businessData array as in HomeScreen for matching IDs)
];

export default function FavouritesScreen({ navigation }) {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const favRef = collection(db, 'users', user.uid, 'favourites');
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      setFavourites(snapshot.docs.map(doc => doc.id));
    });
    return unsubscribe;
  }, [auth.currentUser]);

  const handleBusinessPress = (business) => {
    navigation.navigate('BusinessProfile', { business });
  };

  const favouriteBusinesses = businessData.filter(b => favourites.includes(String(b.id)));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        <Text style={styles.title}>Your Favourites</Text>
        <Text style={styles.description}>Businesses you have saved for quick access. Tap the heart again to remove from favourites.</Text>
        {favouriteBusinesses.length === 0 ? (
          <Text style={styles.emptyMessage}>You have not added any favourites yet. Tap the heart icon on a business card to save it here!</Text>
        ) : (
          favouriteBusinesses.map((business) => (
            <View key={business.id} style={styles.businessCardWrapper}>
              <BusinessCard
                business={business}
                onPress={handleBusinessPress}
                isFavourited={true}
                onToggleFavourite={() => Alert.alert('Go to Home to remove favourites.')}
              />
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
