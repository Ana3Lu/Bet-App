import { DataContext } from '@/contexts/DataContext';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['; 

export default function Users() {
  const { users, getUsers } = useContext(DataContext);
  const router = useRouter();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <View style={styles.container}>
      {/* Círculos decorativos */}
      <View style={[styles.decorShape, styles.decorShapeTopRight]}>
        <LinearGradient
            colors={["#0d9c5c7b", "#293bad7b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderRadius: 60 }}
        />
      </View>

      <Text style={styles.title}>
        <Ionicons name="people-circle" size={30} color="white" /> Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push({
                pathname: "/main/(tabs)/chats/chat/[id]",
                params: { id: item.id }}
            )}
          >
            <View style={styles.listItemImageContainer}>
                <Image
                    source={
                        item.avatar_url
                        ? { uri: item.avatar_url } // if exists in Supabase
                        : require("../../../../assets/images/avatar.png") // Local fallback
                    }
                    style={styles.listItemImage}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={800}
                />
                <Text style={styles.listItemText}>{item.name || item.email}</Text>
                <AntDesign name="right" size={18} color="white" style={{ position: 'absolute', right: 0 }} />
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
    padding: 20
  },
  decorShape: {
    position: "absolute",
    width: 230,
    height: 40,
    borderRadius: 60
  },
  decorShapeTopRight: {
    top: 50,
    right: -40,
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
    borderColor: '#383839ff'
  },
  listItemImageContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItemText: {
    fontSize: 16,
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    fontWeight: '500'
  },
  listItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  }
});