import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NotificationsScreen() {
  const notifications = [
    { id: 1, text: "🎉 Bonus received! +50 coins", date: "2h ago" },
    { id: 2, text: "🏆 You won your Soccer Match bet!", date: "Yesterday" },
    { id: 3, text: "💰 Daily reward claimed", date: "2 days ago" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b266bff" translucent />

      {/* Círculos decorativos */}
      <View style={[styles.decorShape, styles.decorShapeBottomLeft]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} style={{ flex: 1, borderRadius: 60 }} />
      </View>
      <View style={[styles.decorShape, styles.decorShapeTopRight]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} style={{ flex: 1, borderRadius: 60 }} />
      </View>

      {/* Header */}
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => router.push("/main/(tabs)/home")}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Logo */}
      <Image source={require("../../assets/images/Bety.png")} style={styles.logo} />
        
      {/* Contenido */}
      <Text style={styles.title}><Ionicons name="notifications-outline" size={30} color="white" /> Notifications</Text>
      <Text style={styles.subtitle}>Stay up to date with your bets</Text>

      {notifications.map((notif) => (
        <View key={notif.id} style={styles.card}>
          <Text style={styles.cardText}>{notif.text}</Text>
          <Text style={styles.cardDate}>{notif.date}</Text>
        </View>
      ))}
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
    width: 170, 
    height: 40, 
    borderRadius: 60 
  },
  decorShapeBottomLeft: { 
    bottom: 80, 
    left: -40 
  },
  decorShapeTopRight: { 
    top: 110, 
    right: -40 
  },
  logo: { 
    width: 85, 
    height: 85, 
    resizeMode: "contain", 
    alignSelf: "center", 
    marginTop: 50
  },
  title: { 
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#fff", 
    marginTop: 10, 
    marginBottom: 15,
  },
  subtitle: { 
    fontSize: 14, 
    color: "#ccc", 
    marginBottom: 20 
  },
  card: { 
    backgroundColor: "#2b3a7a", 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15 
  },
  cardText: { 
    color: "#fff", 
    fontSize: 16, 
    marginBottom: 5 
  },
  cardDate: { 
    color: "#aaa", 
    fontSize: 12 
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 30
  }
});
