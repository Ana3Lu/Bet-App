import { AuthContext } from "@/contexts/AuthContext";
import { Bet } from "@/contexts/BetContext";
import { supabase } from "@/utils/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect, useState } from "react";
import { Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BetClientScreen() {
  const { user } = useContext(AuthContext);
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    const { data, error } = await supabase.from("bets").select("*").order("created_at", { ascending: false });
    if (!error && data) setBets(data as Bet[]);
  };

  const joinBet = async (betId: string, cost: number) => {
    if (!user) {
      Alert.alert("⚠️ Not logged in", "Please log in before joining a bet.");
      return;
    }

    const { error } = await supabase.from("bets_participations").insert({
      bet_id: betId,
      player_id: user.id,
      amount: cost,
      status: "PENDING",
    });
    if (error) Alert.alert("❌ Error", error.message);
    else Alert.alert("✅ Joined!", "You have successfully joined this bet.");
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

      {/* Logo */}
      <Image 
          source={require("../../assets/images/Bety.png")}
          style={styles.logo}
      />

      <Text style={styles.title}>🏆 Available Bets</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {bets.length === 0 ? (
          <Text style={styles.noBets}>No active bets yet.</Text>
        ) : (
          bets.map((bet) => (
            <View key={bet.id} style={styles.card}>
              {bet.image_url && <Image source={{ uri: bet.image_url }} style={styles.cardImage} />}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{bet.title}</Text>
                <Text style={styles.cardSubtitle}>{bet.description}</Text>
                <Text style={styles.cardSubtitle}>💰 Cost: ${bet.cost}</Text>
                {bet.ends_at && <Text style={styles.cardSubtitle}>⏰ Ends: {new Date(bet.ends_at).toLocaleString()}</Text>}
                <TouchableOpacity
                  style={[styles.cardButton, { backgroundColor: "#4facfe" }]}
                  onPress={() => joinBet(bet.id, bet.cost)}
                >
                  <Text style={styles.cardButtonText}>Join Bet</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
          )
        }
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
  card: {
    flexDirection: "row",
    backgroundColor: "#2b3a7a",
    borderRadius: 15,
    marginBottom: 10,
    overflow: "hidden",
  },
  cardImage: { width: 90, height: 90, borderRadius: 10, margin: 10 },
  cardContent: { flex: 1, justifyContent: "center", paddingRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  cardSubtitle: { fontSize: 14, color: "#ccc", marginTop: 2 },
  cardButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 8,
  },
  cardButtonText: { color: "#fff", fontWeight: "bold" },
  noBets: { color: "#ccc", textAlign: "center", marginTop: 40, fontSize: 16 },
  logo: {
    width: 85,
    height: 85,
    resizeMode: "contain",
    marginBottom: 10,
    alignSelf: "center"
  }
});
