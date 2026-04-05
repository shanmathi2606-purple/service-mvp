// src/components/BusinessCard.js
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BusinessCard = ({ business, onPress, isFavourited, onToggleFavourite }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(business)} activeOpacity={0.9}>
      <Image source={business.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{business.name}</Text>
        <Text style={styles.cardSubtitle}>📍 {business.location}</Text>
        <Text style={styles.cardRating}>⭐ {business.rating} ({business.reviews})</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.distance}>{business.distance}</Text>
        <TouchableOpacity onPress={(e) => { e.stopPropagation && e.stopPropagation(); onToggleFavourite && onToggleFavourite(business); }} style={styles.heartIconWrapper}>
          <Image
            source={require('../../assets/images/heart.png')}
            style={[styles.heartIcon, isFavourited ? styles.heartIconActive : null]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginBottom: 2,
    textAlign: 'center',
  },
  heartIconWrapper: {
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    width: 22,
    height: 22,
    tintColor: '#BDC3C7', // grey by default
  },
  heartIconActive: {
    tintColor: '#e63946', // red when favourited
  },
});

export default BusinessCard;