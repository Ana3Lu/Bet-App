import { AuthContext } from "@/contexts/AuthContext";
import { BetContext } from "@/contexts/BetContext";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import LottieView from 'lottie-react-native';
import { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExploreScreen() {
  const { user } = useContext(AuthContext);
  const { bets, participations, fetchBets, fetchParticipations } =
    useContext(BetContext);
  const { favorites, toggleFavorite, fetchFavorites } = useContext(BetContext);
  const [animateFavorite, setAnimateFavorite] = useState<string | null>(null);

  useEffect(() => {
    fetchBets();
    fetchParticipations();
  }, [fetchBets, fetchParticipations]);

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

    if (!error) {
      Alert.alert("✅ Joined!", "You have successfully joined this bet.");
      await fetchBets();
      await fetchParticipations();
    }
  };

  // 📊 Filtrar las apuestas que debe ver el usuario
  const filteredBets = useMemo(() => {
    if (!user) return [];

    const isAdmin = user.role === "ADMIN";

    // Solo apuestas activas
    const activeBets = bets.filter((b) => b.status === "ACTIVE");

    if (isAdmin) return activeBets;

    // Para clientes: solo las que NO ha unido aún
    return activeBets.filter((b) => !participations.includes(b.id));
  }, [bets, participations, user]);

  useEffect(() => {
  if (user?.id) fetchFavorites(user.id);
}, [fetchFavorites, user]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1b266bff"
        translucent
      />

      {/* Decoración */}
      <View style={[styles.decorShape, styles.decorShapeTopLeft]}>
        <LinearGradient
          colors={["#0d9c5c7b", "#293bad7b"]}
          style={{ flex: 1, borderRadius: 60 }}
        />
      </View>
      <View style={[styles.decorShape, styles.decorShapeTopRight]}>
        <LinearGradient
          colors={["#0d9c5c7b", "#293bad7b"]}
          style={{ flex: 1, borderRadius: 60 }}
        />
      </View>

      {/* Botón atrás */}
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => router.push("/main/(tabs)/home")}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <Image
        source={require("../../assets/images/Bety.png")}
        style={styles.logo}
      />

      {/* Títulos */}
      <Text style={styles.title}>🔍 Explore</Text>
      <Text style={styles.subtitle}>Find active bets to join</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
      {filteredBets.length === 0 ? (
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <LottieView
          source={require("../../assets/animations/No data Found.json")}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
        <Text style={styles.noBets}>No available bets to join right now.</Text>
      </View>
    ) : (
    filteredBets.map((bet) => {
      const isAdmin = user?.role === "ADMIN";

      return (
        <View key={bet.id} style={styles.card}>
          {bet.image_url && (
            <Image source={{ uri: bet.image_url }} style={styles.cardImage} />
          )}
          <View style={styles.cardContent}>
            {/* Título + Favorito */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.cardTitle}>{bet.title}</Text>
              <TouchableOpacity
                onPress={() => {
                  if (user) {
                    toggleFavorite(bet.id, user.id);
                    setAnimateFavorite(bet.id);
                    setTimeout(() => setAnimateFavorite(null), 1000);
                  }
                }}
              >
                <View style={styles.emptyAnimationContainer}>
                  {animateFavorite === bet.id ? (
                    <LottieView
                      source={require("../../assets/animations/Star.json")}
                      autoPlay
                      loop={false}
                      style={{ width: 24, height: 24 }}
                    />
                  ) : (
                    <Ionicons
                      name={favorites.includes(bet.id) ? "star" : "star-outline"}
                      size={24}
                      color={favorites.includes(bet.id) ? "#ffd700" : "#aaa"}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Info adicional */}
            {isAdmin && (
              <Text style={{ color: "#ffd700", fontSize: 13 }}>
                ⭐ {bet.favorites_count || 0} favorites
              </Text>
            )}
            <Text style={styles.cardSubtitle}>{bet.description}</Text>
            <Text style={styles.cardSubtitle}>💰 Cost: ${bet.cost}</Text>
            {bet.ends_at && (
              <Text style={styles.cardSubtitle}>
                ⏰ Ends: {new Date(bet.ends_at).toLocaleString()}
              </Text>
            )}

            {/* Botones */}
            {!isAdmin && (
              <TouchableOpacity
                style={[styles.cardButton, { backgroundColor: "#4facfe" }]}
                onPress={() => joinBet(bet.id, bet.cost)}
              >
                <Text style={styles.cardButtonText}>Join Bet</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.cardButton,
                {
                  backgroundColor: isAdmin ? "#ff9800" : "#0d9c5c",
                  marginTop: 5,
                },
              ]}
              onPress={() => router.push(`/main/bet-details/${bet.id}`)}
            >
              <Text style={styles.cardButtonText}>
                {isAdmin ? "View Details (Admin)" : "View Details"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    })
  )}
</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b266bff",
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  decorShape: { position: "absolute", width: 140, height: 40, borderRadius: 60 },
  decorShapeTopLeft: { top: 85, left: -40 },
  decorShapeTopRight: { top: 200, right: -40 },
  logo: {
    width: 85,
    height: 85,
    resizeMode: "contain",
    marginBottom: 5,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#ccc",
    marginBottom: 20,
    marginTop: 5,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#2b3a7a",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
  },
  cardImage: { width: 90, height: 90, borderRadius: 10, margin: 10 },
  cardContent: { flex: 1, justifyContent: "center", paddingRight: 10, paddingVertical: 10 },
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
  backButton: { position: "absolute", top: 50, left: 30 },
  emptyAnimationContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  }
});
