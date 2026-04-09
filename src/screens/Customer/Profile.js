// src/screens/Profile.js
import { Feather } from '@expo/vector-icons';
import { Bell, ChevronRight, HelpCircle, Settings, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomerBottomNav from '../../../components/CustomerBottomNav';

const Profile = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}> 
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        {/* Profile Content */}    
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={40} color="#34495E" />
            </View>
            <Text style={styles.userName}>Shan</Text>
            <Text style={styles.userEmail}>user@example.com</Text>
          </View>

          {/* Profile Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionItem}>
              <Feather name="user" size={20} color="#34495E" />
              <Text style={styles.optionText}>Edit Profile</Text>
              <ChevronRight size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Bell size={20} color="#34495E" />
              <Text style={styles.optionText}>Notifications</Text>
              <ChevronRight size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <HelpCircle size={20} color="#34495E" />
              <Text style={styles.optionText}>Help & Support</Text>
              <ChevronRight size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Settings size={20} color="#34495E" />
              <Text style={styles.optionText}>Settings</Text>
              <ChevronRight size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
      <CustomerBottomNav navigation={navigation} active="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FBFE",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#34495E",
    textAlign: "center",
  },
  profileSection: {
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: "#EEF3F7",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#34495E",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  optionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF3F7",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#34495E",
    marginLeft: 15,
  },
});

export default Profile;
