import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import BusinessBottomNav from '../../../components/BusinessBottomNav';
import BusinessTopBar from '../../../components/BusinessTopBar';
import { auth, db } from '../../firebase';


export default function ChatScreen({ navigation }) {
  const [selectedThread, setSelectedThread] = useState(null);
  const [input, setInput] = useState('');
  const [threads, setThreads] = useState([]); // [{ id, user, avatar, lastMessage, time, customerId }]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      try {
        // Get current business user
        const businessUser = auth.currentUser;
        if (!businessUser) return;
        // Query threads where businessId == current user
        const q = query(collection(db, 'threads'), where('businessId', '==', businessUser.uid));
        const querySnapshot = await getDocs(q);
        const threadList = [];
        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          // Fetch customer profile
          let user = 'Customer';
          let avatar = null;
          let lastMessage = data.lastMessage || '';
          let time = data.lastMessageTime || '';
          if (data.customerId) {
            const userDoc = await getDoc(doc(db, 'users', data.customerId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              user = userData.username || userData.name || 'Customer';
              avatar = userData.avatar || null;
            }
          }
          threadList.push({
            id: docSnap.id,
            user,
            avatar: avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
            lastMessage,
            time,
            customerId: data.customerId,
          });
        }
        setThreads(threadList);
      } catch (e) {
        console.error('Error fetching threads:', e);
      }
      setLoading(false);
    };
    fetchThreads();
  }, []);

  const handleSend = () => {
    // Implement message sending logic here (to Firestore)
    setInput('');
  };

  if (!selectedThread) {
    return (
      <View style={styles.container}>
        {/* Top Header Bar */}
        <BusinessTopBar navigation={navigation} title="Inbox" />
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 30 }}>Loading...</Text>
        ) : (
          <FlatList
            data={threads}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.thread} onPress={() => setSelectedThread(item)}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.threadInfo}>
                  <Text style={styles.threadUser}>{item.user}</Text>
                  <Text style={styles.threadLast}>{item.lastMessage}</Text>
                </View>
                <Text style={styles.threadTime}>{item.time}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        <BusinessBottomNav navigation={navigation} active="Chat" />
      </View>
    );
  }
  // ...existing code for selectedThread view can be added here if needed...
}

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FBFE',
  },
  // Top bar styles moved to reusable BusinessTopBar component
  thread: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
  },
  threadInfo: {
    flex: 1,
  },
  threadUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
  },
  threadLast: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  threadTime: {
    fontSize: 13,
    color: '#BDC3C7',
    marginLeft: 8,
  },
});