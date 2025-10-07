import { Bet, BetContext } from "@/contexts/BetContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BetAdminScreen() {
  const router = useRouter();
  const { bets, fetchBets, deleteBet } = useContext(BetContext);

  useEffect(() => {
    fetchBets();
  }, [ fetchBets ]);

  const openBetOptions = (bet: Bet) => {
    Alert.alert(
      bet.title,
      'Choose action',
      [
        { text: 'View Participants', onPress: () => router.push(`/main/bet-details/${bet.id}`) },
        { text: 'Edit', onPress: () => router.push(`/main/edit-bet/${bet.id}`) },
        { text: 'Delete', onPress: () => deleteBet?.(bet.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b266bff" translucent />

      <View style={[styles.decorShape, styles.decorShapeTopLeft]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} style={{ flex: 1, borderRadius: 60 }} />
      </View>
      <View style={[styles.decorShape, styles.decorShapeTopRight]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} style={{ flex: 1, borderRadius: 60 }} />
      </View>

      <Image 
        source={require("../../assets/images/Bety.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>🎯 Bets Manager</Text>

      <TouchableOpacity style={styles.listButton} onPress={fetchBets}>
        <LinearGradient colors={["#0d9c5cff", "#293badff"]} style={styles.circleButton}>
          <Ionicons name="list" size={22} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.createButton} onPress={() => router.push("/main/create-bet")}>
        <LinearGradient colors={["#43e97b", "#38f9d7"]} style={styles.circleButton}>
          <Ionicons name="add" size={22} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {bets.length === 0 ? (
          <Text style={styles.noBets}>No bets created yet.</Text>
        ) : (
          bets.map(bet => (
            <View key={bet.id} style={styles.card}>
              {bet.image_url && <Image source={{ uri: bet.image_url }} style={styles.cardImage} />}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{bet.title}</Text>
                <Text style={styles.cardSubtitle}>{bet.description}</Text>
                <Text style={styles.cardSubtitle}>💰 Cost: ${bet.cost}</Text>
                <Text style={styles.cardSubtitle}>🏦 Commission: ${bet.commission}</Text>
              </View>
              <View style={{ position: 'absolute', top: 10, right: 10 }}>
                <TouchableOpacity onPress={() => openBetOptions(bet)}>
                  <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b266bff", paddingHorizontal: 30, paddingTop: 90 },
  decorShape: { position: "absolute", width: 140, height: 40, borderRadius: 60 },
  decorShapeTopLeft: { top: 85, left: -40 },
  decorShapeTopRight: { top: 200, right: -40 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20, textAlign: "center" },
  listButton: { position: "absolute", top: 50, right: 70 },
  createButton: { position: "absolute", top: 50, right: 20 },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#2b3a7a",
    borderRadius: 15,
    marginBottom: 10,
    overflow: "hidden",
  },
  cardImage: { width: 80, height: 80, borderRadius: 10, margin: 10 },
  cardContent: { flex: 1, justifyContent: "center", paddingRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  cardSubtitle: { fontSize: 14, color: "#ccc", marginTop: 2 },
  noBets: { color: "#ccc", textAlign: "center", marginTop: 40, fontSize: 16 },
  logo: {
    width: 85,
    height: 85,
    resizeMode: "contain",
    marginBottom: 10,
    alignSelf: "center"
  }
});
