import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomerBottomNav from '../../../components/CustomerBottomNav';
import { auth, db } from '../../firebase';


export default function InboxScreen({ navigation }) {
  const [threads, setThreads] = useState([]); // [{ id, user, avatar, lastMessage, time, businessId }]
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;
        // Query threads where customerId == current user
        const q = query(collection(db, 'threads'), where('customerId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const threadList = [];
        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          // Fetch business profile
          let userName = 'Business';
          let avatar = null;
          if (data.businessId) {
            const businessDoc = await getDoc(doc(db, 'users', data.businessId));
            if (businessDoc.exists()) {
              const businessData = businessDoc.data();
              userName = businessData.username || businessData.name || 'Business';
              avatar = businessData.avatar || null;
            }
          }
          threadList.push({
            id: docSnap.id,
            user: userName,
            avatar: avatar || 'https://randomuser.me/api/portraits/lego/2.jpg',
            lastMessage: data.lastMessage || '',
            time: data.lastMessageTime || '',
            businessId: data.businessId,
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

  const fetchMessages = async (thread) => {
    setLoadingMessages(true);
    try {
      const messagesCol = collection(db, 'threads', thread.id, 'messages');
      const q = query(messagesCol, orderBy('createdAt', 'asc'));
      const querySnapshot = await getDocs(q);
      const msgs = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          text: data.text,
          sender: data.senderId === auth.currentUser?.uid ? 'me' : thread.user,
          time: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        };
      });
      setMessages(msgs);
    } catch (e) {
      console.error('Error fetching messages:', e);
      setMessages([]);
    }
    setLoadingMessages(false);
  };

  const handleSelectThread = async (thread) => {
    setSelectedThread(thread);
    await fetchMessages(thread);
  };

  const handleSend = async () => {
    // Implement sending message to Firestore if needed
    // For now, just clear input
    setInput('');
  };

  if (!selectedThread) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}> Inbox</Text>
        <View style={{ flex: 3 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#34495E" style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={threads}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.thread} onPress={() => handleSelectThread(item)}>
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  <View style={styles.threadInfo}>
                    <Text style={styles.threadUser}>{item.user}</Text>
                    <Text style={styles.threadLast}>{item.lastMessage}</Text>
                  </View>
                  <Text style={styles.threadTime}>{item.time}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 80 }}
            />
          )}
        </View>
        <CustomerBottomNav navigation={navigation} active="Inbox" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatUser}>{selectedThread.user}</Text>
      </View>
      <View style={{ flex: 1 }}>
        {loadingMessages ? (
          <ActivityIndicator size="large" color="#34495E" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[styles.message, item.sender === 'me' ? styles.myMessage : styles.theirMessage]}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageTime}>{item.time}</Text>
              </View>
            )}
            contentContainerStyle={styles.messagesList}
          />
        )}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
      <CustomerBottomNav navigation={navigation} active="Inbox" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FBFE' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#34495E', textAlign: 'center', marginTop: 40, marginBottom: 20 },
  thread: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 16 },
  threadInfo: { flex: 1 },
  threadUser: { fontWeight: 'bold', fontSize: 16, color: '#34495E' },
  threadLast: { color: '#888', fontSize: 13 },
  threadTime: { color: '#aaa', fontSize: 12 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  chatUser: { fontWeight: 'bold', fontSize: 18, color: '#34495E', marginLeft: 12 },
  messagesList: { padding: 16 },
  message: { marginBottom: 12, padding: 10, borderRadius: 10, maxWidth: '80%' },
  myMessage: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  theirMessage: { backgroundColor: '#fff', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#eee' },
  messageText: { fontSize: 15, color: '#34495E' },
  messageTime: { fontSize: 11, color: '#888', marginTop: 4, textAlign: 'right' },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  input: { flex: 1, backgroundColor: '#F0F0F0', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, fontSize: 15, marginRight: 8 },
  sendButton: { backgroundColor: '#34495E', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8 },
  sendText: { color: '#fff', fontWeight: 'bold' },
});
