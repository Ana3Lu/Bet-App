import { AuthContext } from '@/contexts/AuthContext';
import React, { useContext, useEffect, useState } from 'react';

import { useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from "react-native";
  
interface Message {
    id: string,   // UUID
    text: string,
    sentBy: string,   // UUID FK id profile
    media?: {
        url: string,
        type: 'image' | 'video'
    },
    createdAt: Date,
    deletedAt: Date | null,
    editedAt: Date | null,
    seenAt: Date | null
    sentAt: Date | null,
    chatId:string   // UUID FK chat id
}

interface chat {
    id: string,   //UUID FK profile id
    userId: string,   // UUID FK profile id
    userId2: string,
    messages: Message[]
}


export default function Chat() {
  const { user } = useContext(AuthContext);
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [chat, setChat] = useState<chat | null>(null);

  useEffect(() => {
  if (!user || !userId) return;

  // Dummy chat with initial message
  const initialChat: chat = {
    id: crypto.randomUUID(),
    userId: user.id,
    userId2: userId,
    messages: [
      {
        id: crypto.randomUUID(),
        text: "¡Hola!",
        sentBy: user.id,
        createdAt: new Date(),
        deletedAt: null,
        editedAt: null,
        seenAt: null,
        sentAt: new Date(),
        chatId: "temp-chat-id"
      }
    ]
  };

    setChat(initialChat);
  }, [user, userId]);

  if (!chat) return <Text>Loading chat...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat con {chat.userId2}</Text>
      <FlatList
        data={chat.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.message,
            item.sentBy === user?.id ? styles.myMessage : styles.otherMessage
          ]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>{item.createdAt.toLocaleTimeString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#1b266bff" 
  },
  header: { 
    fontSize: 18, 
    color: "white", 
    marginBottom: 10 
  },
  message: { 
    padding: 10, 
    marginVertical: 4, 
    borderRadius: 10, 
    maxWidth: "80%" 
  },
  myMessage: { 
    backgroundColor: "#4facfe", 
    alignSelf: "flex-end" 
  },
  otherMessage: { 
    backgroundColor: "#2c2f7c", 
    alignSelf: "flex-start" 
  },
  messageText: { 
    color: "white" 
  },
  timestamp: { 
    fontSize: 10, 
    color: "#ddd", 
    marginTop: 4, 
    textAlign: "right" 
  }
});