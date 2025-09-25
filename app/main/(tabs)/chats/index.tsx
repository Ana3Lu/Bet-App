import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * A function component that displays a list of users from Supabase.
 * It excludes the current user from the list.
 * Each user is displayed as a list item with their name and an optional avatar.
 * When a user is clicked, the app navigates to the chat screen with the selected user.
 */
/*******  0bd6c025-a691-43c0-8d2e-9d11cd1717b8  *******/
export default function Users() {
  const [users, setUsers] = useState<Profile[]>([]);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) {
        console.error(error);
        } else {
        const filtered = (data as Profile[]).filter((u) => u.id !== user?.id);
        setUsers(filtered);
        }
    };
    fetchUsers();
  }, [user?.id]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}><Ionicons name="people-circle" size={30} color="white" /> Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push({pathname: '/main/(tabs)/chats/chat', params: { userId: item.id }})}
          >
            <View style={styles.listItemImageContainer}>
                <Image
                    source={
                        item.avatar_url
                        ? { uri: item.avatar_url } // si existe en Supabase
                        : require("../../../../assets/images/avatar.png") // fallback local
                    }
                    style={styles.listItemImage}
                />
                <Text style={styles.listItemText}>{item.name || item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b266bff",
    padding: 30
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 20
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  listItemImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 16,
    color: '#fff',
    padding: 10,
    borderRadius: 10
  },
  listItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  }
});