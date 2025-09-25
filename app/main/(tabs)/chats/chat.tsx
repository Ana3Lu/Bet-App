import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
  
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
    chatId:string,   // UUID FK chat id
    avatar_url?: string
}

interface chat {
    id: string,   //UUID FK profile id
    userId: string,   // UUID FK profile id
    userId2: string,
    messages: Message[]
}


export default function ChatScreen() {
  const { user } = useContext(AuthContext);
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [chat, setChat] = useState<chat | null>(null);
  const [otherUserName, setOtherUserName] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");

  // Fetch chat + messages
  useEffect(() => {
    if (!user || !userId) return;

    const fetchOrCreateChat = async () => {
      // Look for existing chat
      const { data: existingChats } = await supabase
        .from("chats")
        .select("*")
        .or(
          `and(user_id.eq.${user.id},user_id2.eq.${userId}),and(user_id.eq.${userId},user_id2.eq.${user.id})`
        )
        .limit(1);

      let chatData = existingChats?.[0];

      if (!chatData) {
        const { data: newChat } = await supabase
          .from("chats")
          .insert([{ user_id: user.id, user_id2: userId }])
          .select()
          .single();

        chatData = newChat;
      }

      // Bring messages
      const { data: messages } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!sent_by (
            id,
            name,
            email,
            avatar_url
          )
        `)
        .eq("chat_id", chatData.id)
        .order("created_at", { ascending: true });

      // Convert strings to Date
      const parsedMessages = (messages || []).map((m) => ({
        ...m,
        createdAt: m.created_at ? new Date(m.created_at) : null,
        seenAt: m.seen_at ? new Date(m.seen_at) : null,
        sentAt: m.sent_at ? new Date(m.sent_at) : null,
        editedAt: m.edited_at ? new Date(m.edited_at) : null,
        deletedAt: m.deleted_at ? new Date(m.deleted_at) : null,
        avatar_url: m.sender?.avatar_url || null,
        senderName: m.sender?.name || m.sender?.email || "Usuario"
      }));

      setChat({ ...chatData, messages: parsedMessages });

      // Bring user name
      const { data: otherUser } = await supabase
        .from("profiles")
        .select("name, email")
        .eq("id", userId)
        .single();

      if (otherUser) setOtherUserName(otherUser.name || otherUser.email);
    };

    fetchOrCreateChat();
  }, [user, userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat || !user) return;

    const { data: message } = await supabase
      .from("messages")
      .insert([
        {
          text: newMessage,
          sent_by: user.id,
          chat_id: chat.id
        }
      ])
      .select()
      .single();

    if (message) {
      setChat((prev) =>
        prev ? { ...prev, messages: [...prev.messages, message] } : prev
      );
      setNewMessage("");
    }
  };

  if (!chat) return <Text style={{ color: "white", padding: 20 }}>Cargando chat...</Text>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle" size={28} color="white" />
        <Text style={styles.headerText}>{otherUserName}</Text>
      </View>

      {/* Mensajes */}
      <FlatList
        data={chat.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isMyMessage = item.sentBy === user?.id;
          return (
            <View
              style={[
                styles.messageRow,
                isMyMessage ? styles.myMessageRow : styles.otherMessageRow
              ]}
            >
              {/* Mensaje */}
              <View
                style={[
                  styles.bubble,
                  isMyMessage ? styles.myBubble : styles.otherBubble
                ]}
              >
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestamp}>
                  {item.createdAt
                    ? item.createdAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </Text>
              </View>

              {/* Avatar */}
              <Image
                source={
                  item.avatar_url
                    ? { uri: item.avatar_url }
                    : require("../../../../assets/images/avatar.png")
                }
                style={styles.listItemImage}
              />
            </View>
          );
        }}
        contentContainerStyle={{ padding: 15, paddingBottom: 80 }}
      />

      {/* Input de mensaje */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#aaa"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#1b266bff" 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333"
  },
  headerText: { 
    color: "white", 
    fontSize: 18, 
    marginLeft: 10 
  },
  messageRow: { 
    flexDirection: "row", 
    marginVertical: 6, 
    alignItems: "flex-end"
  },
  myMessageRow: { 
    flexDirection: "row-reverse",
    justifyContent: "flex-start"
  },
  otherMessageRow: { 
    flexDirection: "row", 
    justifyContent: "flex-start"
  },
  avatar: { 
    marginRight: 6 
  },
  bubble: {
    padding: 10,
    borderRadius: 15,
    maxWidth: "75%"
  },
  myBubble: {
    backgroundColor: "#4facfe",
    borderBottomRightRadius: 0
  },
  otherBubble: {
    backgroundColor: "#2c2f7c",
    borderBottomLeftRadius: 0
  },
  messageText: { color: "white", fontSize: 15 },
  timestamp: {
    fontSize: 10,
    color: "#ddd",
    marginTop: 4,
    textAlign: "right"
  },
  listItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#3d394aff",
    backgroundColor: "#1b266b"
  },
  input: {
    flex: 1,
    backgroundColor: "#2c2f7c",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: "white"
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#4facfe",
    padding: 10,
    borderRadius: 20,
  }
});