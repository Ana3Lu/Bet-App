import { Bet, BetContext } from "@/contexts/BetContext";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AuthContext } from "@/contexts/AuthContext";

interface ProfileSummary {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

interface Participant {
  id: string;
  amount: number;
  status: string;
  player_id: ProfileSummary;
}

export default function BetDetailsScreen() {
  const { betId } = useLocalSearchParams<{ betId: string }>();
  const [bet, setBet] = useState<Bet | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { closeBet } = useContext(BetContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!betId) return;

    // Obtener datos de la apuesta
    supabase
      .from('bets')
      .select('*')
      .eq('id', betId)
      .single()
      .then(({ data }) => setBet(data || null));

    // Obtener participantes y su info de perfil
    supabase
      .from('bets_participations')
      .select('*, player_id(id,name,email,avatar_url)')
      .eq('bet_id', betId)
      .then(({ data }) => setParticipants(data || []));
  }, [betId]);

  if (!bet) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Imagen con borde degradado */}
      {bet.image_url && (
        <View style={styles.imageWrapper}>
          <LinearGradient
            colors={["#0d9c5c7b", "#293bad7b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <Image source={{ uri: bet.image_url }} style={styles.betImage} />
          </LinearGradient>
        </View>
      )}

      <Text style={styles.title}>{bet.title}</Text>
      <Text style={styles.description}>{bet.description}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>💰 Entry cost:</Text>
        <Text style={styles.infoValue}>${bet.cost}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>🏦 Admin commission:</Text>
        <Text style={styles.infoValue}>${bet.commission}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Status:</Text>
        <Text style={styles.infoValue}>{bet.status}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Created at:</Text>
        <Text style={styles.infoValue}>{new Date(bet.created_at).toLocaleString()}</Text>
      </View>
      {bet.ends_at && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ends at:</Text>
          <Text style={styles.infoValue}>{new Date(bet.ends_at).toLocaleString()}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Participants ({participants.length})</Text>

      {participants.length === 0 ? (
        <Text style={styles.noParticipants}>No participants yet.</Text>
      ) : (
        participants.map(p => (
          <View key={p.id} style={styles.card}>
              {p.player_id?.avatar_url && (
                <Image source={{ uri: p.player_id.avatar_url }} style={styles.avatar} />
              )}
              <View style={styles.cardContent}>
                <Text style={styles.name}>{p.player_id?.name}</Text>
                <Text style={styles.email}>{p.player_id?.email}</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Amount:</Text>
                  <Text style={styles.infoValue}>${p.amount}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Status: </Text>
                  <Text style={styles.infoValue}>{p.status}</Text>
                </View>
              </View>
        
            {user?.role === "ADMIN" && bet.status === "ACTIVE" && (
              <TouchableOpacity
                style={[styles.cardButton, { backgroundColor: "#4caf50", marginTop: 10, alignSelf: "center" }]}
                onPress={() =>
                  Alert.alert(
              "Confirm Winner",
              `Set ${p.player_id?.name} as winner?`,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Confirm",
                  onPress: async () => {
                    await closeBet(bet.id, p.player_id.id);
                    Alert.alert("✅ Bet Closed", `${p.player_id.name} is the winner!`);
                    router.back();
                  },
                },
              ]
            )
          }
          >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Set Winner</Text>
        </TouchableOpacity>
      )}
    </View>
    ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b266bff", padding: 20 },
  loading: { color: "#ccc", textAlign: "center", marginTop: 50 },

  imageWrapper: { alignItems: "center", marginTop: 50, marginBottom: 20 },
  gradientBorder: { padding: 5, borderRadius: 15 },
  betImage: { width: 300, height: 200, borderRadius: 12 },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  description: { fontSize: 16, color: "#ccc", marginBottom: 15 },
  
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  infoText: { color: "#ccc" },

  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", marginVertical: 15 },
  card: { flexDirection: "row", backgroundColor: "#2b3a7a", padding: 10, borderRadius: 12, marginBottom: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  cardContent: { justifyContent: "center", paddingRight: 10, flex: 1 },
  name: { fontWeight: "bold", color: "#fff" },
  email: { color: "#ccc" },
  noParticipants: { textAlign: "center", color: "#ccc", marginTop: 10 },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10
  },
  infoLabel: { color: "#ffffffff", fontWeight: "bold", alignSelf: "flex-start" }, 
  infoValue: { color: "#adb4ffff" },
  cardButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
    marginBottom: 10,
  },
});
