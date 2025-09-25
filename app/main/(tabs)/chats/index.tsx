import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

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
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 12, borderBottomWidth: 1, borderColor: "#ddd" }}
            onPress={() => router.push({pathname: '/main/(tabs)/chats/chat', params: { userId: item.id }})}
          >
            <Text>{item.name || item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}