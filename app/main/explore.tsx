import { AuthContext } from "@/contexts/AuthContext";
import { BetContext } from "@/contexts/BetContext";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useContext, useEffect, useMemo } from "react";
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
          <Text style={styles.noBets}>
            No available bets to join right now.
          </Text>
        ) : (
          filteredBets.map((bet) => {
            const isAdmin = user?.role === "ADMIN";

            return (
              <View key={bet.id} style={styles.card}>
                {bet.image_url && (
                  <Image
                    source={{ uri: bet.image_url }}
                    style={styles.cardImage}
                  />
                )}
                <View style={styles.cardContent}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.cardTitle}>{bet.title}</Text>

                    {/* ❤️ Favorito */}
                    <TouchableOpacity onPress={() => user && toggleFavorite(bet.id, user.id)}>
                      <Ionicons
                        name={favorites.includes(bet.id) ? "star" : "star-outline"}
                        size={24}
                        color={favorites.includes(bet.id) ? "#ffd700" : "#aaa"}
                      />
                    </TouchableOpacity>
                  </View>

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

                  {/* 🔹 Mostrar "Join Bet" solo si NO es admin */}
                  {!isAdmin && (
                    <TouchableOpacity
                      style={[
                        styles.cardButton,
                        { backgroundColor: "#4facfe" },
                      ]}
                      onPress={() => joinBet(bet.id, bet.cost)}
                    >
                      <Text style={styles.cardButtonText}>Join Bet</Text>
                    </TouchableOpacity>
                  )}

                  {/* 🔹 Mostrar siempre "View Details" */}
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
    paddingTop: 80,
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
});
