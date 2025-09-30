import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  const { id } = useLocalSearchParams<{ id: string }>();

  const [chat, setChat] = useState<chat | null>(null);
  const [otherUserName, setOtherUserName] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");

  const router = useRouter();

  const parseMessage = (m: any): Message => ({ 
    ...m,
    createdAt: m.created_at ? new Date(m.created_at) : null,
    seenAt: m.seen_at ? new Date(m.seen_at) : null,
    sentAt: m.sent_at ? new Date(m.sent_at) : null,
    editedAt: m.edited_at ? new Date(m.edited_at) : null,
    deletedAt: m.deleted_at ? new Date(m.deleted_at) : null,
    avatar_url: m.sender?.avatar_url || null,
    senderName: m.sender?.name || m.sender?.email || "User",
    sentBy: m.sent_by || m.sender?.id,
    chatId: m.chat_id || m.chat?.id
  });

  // Bring chat and messages
  useEffect(() => {
    if (!user || !id) return;

    const fetchOrCreateChat = async () => {
      // Look for existing chat
      const { data: existingChats } = await supabase
        .from("chats")
        .select("*")
        .or(
          `and(user_id.eq.${user.id},user_id2.eq.${id}),and(user_id.eq.${id},user_id2.eq.${user.id})`
        )
        .limit(1);

      let chatData = existingChats?.[0];

      if (!chatData) {
        const { data: newChat } = await supabase
          .from("chats")
          .insert([{ user_id: user.id, user_id2: id }])
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

      setChat({ 
        ...chatData, 
        messages: (messages || []).map(parseMessage) 
      });

      // Bring user name
      const { data: otherUser } = await supabase
        .from("profiles")
        .select("name, email")
        .eq("id", id)
        .single();

      if (otherUser) setOtherUserName(otherUser.name || otherUser.email);
    };

    fetchOrCreateChat();
  }, [user, id]);

  useEffect(() => {
    if (!chat) return;

    //console.log("📡 Subscribing to Realtime for chat:", chat.id);

    const channel = supabase
      .channel("chat-${chat.id}")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chat.id}`,
        },
        async (payload) => {
          //console.log("Realtime payload:", payload);

          // Receive new message
          const newRow = payload.new as any;

          // Bring sender info 
          const { data: sender } = await supabase
            .from("profiles")
            .select("id, name, email, avatar_url")
            .eq("id", newRow.sent_by)
            .single();

          const newMsg = parseMessage({
            ...newRow,
            sender
          });

          setChat((prev) =>
            prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev 
          );
        }
      )
      .subscribe();

      return () => {
        //console.log("Unsubscribing from Realtime for chat:", chat?.id);
        supabase.removeChannel(channel);
      };
  }, [chat]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat || !user) return;

    await supabase
        .from("messages")
        .insert([
          {
            text: newMessage,
            sent_by: user.id,
            chat_id: chat.id
          }
        ]);

    setNewMessage(""); // Realtime adds message
  };

  if (!chat) return <Text style={{ color: "white", padding: 20 }}>Loading chat...</Text>;

  return (
    <View style={styles.container}>
      {/* Fondo */}
      <View style={styles.background}>
        <LinearGradient
          colors={["#680b78a1", "#19246c7b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1}}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
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
                {isMyMessage ? (
                <>
                    {/* Mi mensaje primero */}
                    <View style={[styles.bubble, styles.myBubble]}>
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

                    {/* Luego avatar */}
                    <Image
                    source={
                        item.avatar_url
                        ? { uri: item.avatar_url }
                        : require("../../../../../assets/images/avatar.png")
                    }
                    style={styles.listItemImage}
                    />
                </>
                ) : (
                <>
                    {/* Avatar primero */}
                    <Image
                    source={
                        item.avatar_url
                        ? { uri: item.avatar_url }
                        : require("../../../../../assets/images/avatar.png")
                    }
                    style={styles.listItemImage}
                    />

                    {/* Luego mensaje */}
                    <View style={[styles.bubble, styles.otherBubble]}>
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
                </>
                )}
            </View>
            );
        }}
        contentContainerStyle={{ padding: 15, paddingBottom: 80 }}
        />

      {/* Input de mensaje */}
      <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            placeholder="Write a message..."
            placeholderTextColor="#aaa"
            value={newMessage}
            onChangeText={setNewMessage}
        />

        <TouchableOpacity 
            style={styles.buttonWrapper} 
            onPress={handleSendMessage}
        >
            <LinearGradient
            colors={["#4facfe", "#43e97b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
            >
            <Ionicons name="send" size={20} color="white" />
            </LinearGradient>
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
  background: { 
    position: "absolute", 
    width: "100%", 
    height: "100%" 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333"
  },
  headerText: { 
    color: "white", 
    fontSize: 22, 
    marginLeft: 10 
  },
  messageRow: { 
    flexDirection: "row", 
    marginVertical: 6, 
    alignItems: "flex-end"
  },
  myMessageRow: { 
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  otherMessageRow: { 
    flexDirection: "row", 
    justifyContent: "flex-start"
  },
  bubble: {
    padding: 10,
    borderRadius: 15,
    maxWidth: "75%",
    marginHorizontal: 10
  },
  myBubble: {
    backgroundColor: "#722de09a",
    borderBottomRightRadius: 0
  },
  otherBubble: {
    backgroundColor: "#4a499d6c",
    borderBottomLeftRadius: 0
  },
  messageText: { 
    color: "white", 
    fontSize: 15 
  },
  timestamp: {
    fontSize: 10,
    color: "#ddd",
    marginTop: 4,
    textAlign: "right"
  },
  listItemImage: {
    width: 30,
    height: 30,
    borderRadius: 20
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
  button: { 
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25, 
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  buttonWrapper: {
    width: 40,
    height: 40,
    borderRadius: 25, 
    overflow: "hidden",
    marginLeft: 10, 
    },
});