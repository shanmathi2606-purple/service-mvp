import React, { useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomerBottomNav from '../../../components/CustomerBottomNav';

const sampleThreads = [
  {
    id: '1',
    user: 'Alicee225',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'See you tomorrow!',
    time: '2:15 PM',
    messages: [
      { id: 'm1', text: 'Hey Alice!', sender: 'me', time: '2:10 PM' },
      { id: 'm2', text: 'Hi! Ready for your booking?', sender: 'Alicee225', time: '2:11 PM' },
      { id: 'm3', text: 'Yes, see you tomorrow!', sender: 'me', time: '2:15 PM' },
    ],
  },
  {
    id: '2',
    user: 'JohnL88',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'Thanks!',
    time: '1:05 PM',
    messages: [
      { id: 'm1', text: 'Your booking is confirmed.', sender: 'me', time: '1:00 PM' },
      { id: 'm2', text: 'Thanks!', sender: 'JohnL88', time: '1:05 PM' },
    ],
  },
  {
    id: '3',
    user: 'PriyaSg',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    lastMessage: 'Can I reschedule?',
    time: '12:30 PM',
    messages: [
      { id: 'm1', text: 'Can I reschedule?', sender: 'PriyaSg', time: '12:30 PM' },
    ],
  },
];

export default function InboxScreen({ navigation }) {
  const [selectedThread, setSelectedThread] = useState(null);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setSelectedThread({
      ...selectedThread,
      messages: [
        ...selectedThread.messages,
        { id: `m${selectedThread.messages.length + 1}`, text: input, sender: 'me', time: 'Now' },
      ],
    });
    setInput('');
  };

  if (!selectedThread) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Inbox</Text>
        <View style={{ flex: 1 }}>
          <FlatList
            data={sampleThreads}
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
            contentContainerStyle={{ paddingBottom: 80 }}
          />
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
        <FlatList
          data={selectedThread.messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.message, item.sender === 'me' ? styles.myMessage : styles.theirMessage]}>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.messageTime}>{item.time}</Text>
            </View>
          )}
          contentContainerStyle={styles.messagesList}
        />
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
  header: { fontSize: 24, fontWeight: 'bold', color: '#34495E', textAlign: 'center', marginVertical: 20 },
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
