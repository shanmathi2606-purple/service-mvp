import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PaynowQRCode from '../../../components/PaynowQRCode';

import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

import BusinessBottomNav from '../../../components/BusinessBottomNav';
import BusinessTopBar from '../../../components/BusinessTopBar';



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBackground: { backgroundColor: '#e3e6ff', paddingVertical: 16 },
  topBarRowExpanded: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  topBarButton: { padding: 8 },
  topBarIconCircle: { backgroundColor: '#fff', borderRadius: 20, padding: 6 },
  topBarWelcomeText: { fontSize: 18, fontWeight: 'bold', color: '#0a2540' },
});


const AccountScreen = ({ navigation }) => {
  const [tab, setTab] = useState('Profile');
  // Profile fields
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categories = [
    'Beauty',
    'Wellness',
    'Food & Dining',
    'Freelance'
  ];
  // Menu of services
  const [menu, setMenu] = useState([]); // [{name, price}]
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');

  // Region state (fix ReferenceError)
  const [region, setRegion] = useState('');
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const regions = ['Central', 'North', 'East', 'West'];

  // Load business profile on mount/login
  React.useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const docRef = doc(db, 'businessProfiles', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || '');
          setImage(data.image || '');
          setDescription(data.description || '');
          setCategory(data.category || '');
          setMenu(Array.isArray(data.menu) ? data.menu : []);
          setRegion(data.region || '');
        }
      } catch (e) {
        // Optionally handle error
      }
    };
    loadProfile();
  }, []);

  const addService = () => {
    if (!serviceName.trim() || !servicePrice.trim()) return;
    setMenu([...menu, { name: serviceName.trim(), price: servicePrice.trim() }]);
    setServiceName('');
    setServicePrice('');
  };
  const removeService = (idx) => {
    setMenu(menu.filter((_, i) => i !== idx));
  };

  // Save business profile to Firestore
  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Not signed in');
      return;
    }
    try {
      // Save business profile
      await setDoc(doc(db, 'businessProfiles', user.uid), {
        name,
        image,
        description,
        category,
        region,
        menu,
        uid: user.uid,
        email: user.email,
        updatedAt: new Date().toISOString(),
      });
      // Ensure business user is in users collection
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        role: 'business',
        name,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      alert('Profile saved!');
    } catch (e) {
      alert('Error saving profile: ' + e.message);
    }
  };

  // (moved above for clarity)

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.container}>
        <BusinessTopBar navigation={navigation} title="Account Management" />
        {/* Tabs */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
          <TouchableOpacity onPress={() => setTab('Profile')} style={[tab==='Profile' && { borderBottomWidth: 2, borderColor: '#2563eb' }, { marginHorizontal: 24, paddingBottom: 6 }]}> 
            <Text style={{ fontWeight: '700', color: tab==='Profile' ? '#2563eb' : '#34495E', fontSize: 16 }}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('History')} style={[tab==='History' && { borderBottomWidth: 2, borderColor: '#2563eb' }, { marginHorizontal: 24, paddingBottom: 6 }]}> 
            <Text style={{ fontWeight: '700', color: tab==='History' ? '#2563eb' : '#34495E', fontSize: 16 }}>History</Text>
          </TouchableOpacity>
        </View>
        {/* Main Content */}
        <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
          {tab === 'Profile' && (
            <>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#0a2540', marginBottom: 12 }}>Business Profile Setup</Text>
              <Text style={{ color: '#34495E', marginBottom: 4 }}>Business Category</Text>
              <TouchableOpacity
                style={{ backgroundColor: '#f5f6fa', borderRadius: 8, borderWidth: 1, borderColor: '#ECF0F1', marginBottom: 8, padding: 12 }}
                onPress={() => setCategoryDropdownOpen(true)}
              >
                <Text style={{ color: category ? '#34495E' : '#888' }}>
                  {category || 'Select category...'}
                </Text>
              </TouchableOpacity>
              {/* Modal Dropdown for Category Selection */}
              {categoryDropdownOpen && (
                <View style={{
                  position: 'absolute',
                  top: 140, // adjust as needed
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  zIndex: 10,
                  flex: 1,
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '80%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#2563eb', marginBottom: 12 }}>Select Category</Text>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 16,
                          borderRadius: 8,
                          backgroundColor: category === cat ? '#0a2540' : '#f5f6fa',
                          marginVertical: 4,
                          width: '100%',
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          setCategory(cat);
                          setCategoryDropdownOpen(false);
                        }}
                      >
                        <Text style={{ color: category === cat ? '#fff' : '#34495E', fontWeight: category === cat ? '700' : '400' }}>{cat}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={{ backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24, marginTop: 12 }}
                      onPress={() => setCategoryDropdownOpen(false)}
                    >
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <Text style={{ color: '#34495E', marginBottom: 4 }}>Business Name</Text>
              <TextInput value={name} onChangeText={setName} placeholder="Enter business name" style={inputStyle} />
              <Text style={{ color: '#34495E', marginBottom: 4, marginTop: 12 }}>Image URL</Text>
              <TextInput value={image} onChangeText={setImage} placeholder="Paste image URL" style={inputStyle} />
              <Text style={{ color: '#34495E', marginBottom: 4, marginTop: 12 }}>Description</Text>
              <TextInput value={description} onChangeText={setDescription} placeholder="Describe your business" style={[inputStyle, { minHeight: 60 }]} multiline />
              <Text style={{ fontWeight: '700', color: '#0a2540', marginTop: 24, marginBottom: 8, fontSize: 16 }}>Menu of Services</Text>
              <Text style={{ color: '#34495E', marginBottom: 4, marginTop: 12 }}>Region in Singapore</Text>
              <TouchableOpacity
                style={{ backgroundColor: '#f5f6fa', borderRadius: 8, borderWidth: 1, borderColor: '#ECF0F1', marginBottom: 8, padding: 12 }}
                onPress={() => setRegionDropdownOpen(true)}
              >
                <Text style={{ color: region ? '#34495E' : '#888' }}>
                  {region || 'Select region...'}
                </Text>
              </TouchableOpacity>
              {/* Modal Dropdown for Region Selection */}
              {regionDropdownOpen && (
                <View style={{
                  position: 'absolute',
                  top: 200, // adjust as needed
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  zIndex: 10,
                  flex: 1,
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '80%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#2563eb', marginBottom: 12 }}>Select Region</Text>
                    {regions.map((reg) => (
                      <TouchableOpacity
                        key={reg}
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 16,
                          borderRadius: 8,
                          backgroundColor: region === reg ? '#0a2540' : '#f5f6fa',
                          marginVertical: 4,
                          width: '100%',
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          setRegion(reg);
                          setRegionDropdownOpen(false);
                        }}
                      >
                        <Text style={{ color: region === reg ? '#fff' : '#34495E', fontWeight: region === reg ? '700' : '400' }}>{reg}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={{ backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24, marginTop: 12 }}
                      onPress={() => setRegionDropdownOpen(false)}
                    >
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {/* Add Service Form */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <TextInput value={serviceName} onChangeText={setServiceName} placeholder="Service name" style={[inputStyle, { flex: 2, marginRight: 8 }]} />
                <TextInput value={servicePrice} onChangeText={setServicePrice} placeholder="Price (e.g. $45)" style={[inputStyle, { flex: 1, marginRight: 8 }]} keyboardType="default" />
                <TouchableOpacity onPress={addService} style={{ backgroundColor: '#071532', borderRadius: 8, padding: 10 }}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Add</Text>
                </TouchableOpacity>
              </View>
              {/* Menu List */}
              {menu.length === 0 ? (
                <Text style={{ color: '#888', marginBottom: 10 }}>No services added yet.</Text>
              ) : (
                <FlatList
                  data={menu}
                  keyExtractor={(_, idx) => idx.toString()}
                  renderItem={({ item, index }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f6fa', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                      <Text style={{ flex: 2, color: '#34495E', fontWeight: '600' }}>{item.name}</Text>
                      <Text style={{ flex: 1, color: '#061127', fontWeight: '700', textAlign: 'right' }}>{item.price}</Text>
                      <TouchableOpacity onPress={() => removeService(index)} style={{ marginLeft: 12 }}>
                        <Text style={{ color: '#e74c3c', fontWeight: '700' }}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  scrollEnabled={false}
                  ListFooterComponent={null}
                />
              )}
              {/* Payment Methods: PayNow */}
              <Text style={{ fontWeight: '700', color: '#0a2540', marginTop: 28, marginBottom: 8, fontSize: 16 }}>Payment Methods</Text>
              <View style={{ backgroundColor: '#f5f6fa', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <Text style={{ fontWeight: '600', color: '#34495E', marginBottom: 8 }}>PayNow</Text>
                <PaynowQRCode />
              </View>
              {/* Save button (future: connect to Firestore) */}
              <TouchableOpacity onPress={handleSaveProfile} style={{ backgroundColor: '#01012c', borderRadius: 8, padding: 14, marginTop: 18 }}>
                <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center', fontSize: 16 }}>Save Profile</Text>
              </TouchableOpacity>
            </>
          )}
          {tab === 'History' && (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: '#888', fontSize: 16 }}>Booking and activity history coming soon.</Text>
            </View>
          )}
        </ScrollView>
        <BusinessBottomNav navigation={navigation} active="Account" />
      </View>
    </KeyboardAvoidingView>
  );
};

const inputStyle = {
  backgroundColor: '#f5f6fa',
  borderRadius: 8,
  padding: 10,
  marginBottom: 8,
  color: '#34495E',
  borderWidth: 1,
  borderColor: '#ECF0F1',
};

export default AccountScreen;


