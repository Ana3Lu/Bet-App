import { Bet } from "@/contexts/BetContext";
import { supabase } from "@/utils/supabase";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface Participant {
  id: string;
  amount: number;
  status: string;
  player_id: {
    name: string;
    email: string;
    avatar_url?: string;
  };
}

export default function BetDetailsScreen() {
  const { betId } = useLocalSearchParams<{ betId: string }>();
  const [bet, setBet] = useState<Bet | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

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
      .select('*, player_id(name,email,avatar_url)')
      .eq('bet_id', betId)
      .then(({ data }) => setParticipants(data || []));
  }, [betId]);

  if (!bet) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>

      {bet.image_url && <Image source={{ uri: bet.image_url }} style={styles.betImage} />}

      <Text style={styles.title}>{bet.title}</Text>
      <Text style={styles.description}>{bet.description}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>💰 Cost: ${bet.cost}</Text>
        <Text style={styles.infoText}>🏦 Commission: ${bet.commission}</Text>
      </View>
      <Text style={styles.infoText}>Status: {bet.status}</Text>
      <Text style={styles.infoText}>Created at: {new Date(bet.created_at).toLocaleString()}</Text>
      {bet.ends_at && <Text style={styles.infoText}>Ends at: {new Date(bet.ends_at).toLocaleString()}</Text>}

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
              <Text>Amount: ${p.amount}</Text>
              <Text>Status: {p.status}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b266bff", padding: 20 },
  loading: { color: "#ccc", textAlign: "center", marginTop: 50 },

  betImage: { width: "100%", height: 200, borderRadius: 15, marginBottom: 15 },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  description: { fontSize: 16, color: "#ccc", marginBottom: 15 },
  
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  infoText: { color: "#ccc" },

  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", marginVertical: 15 },
  card: { flexDirection: "row", backgroundColor: "#2b3a7a", padding: 10, borderRadius: 12, marginBottom: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  cardContent: { justifyContent: "center" },
  name: { fontWeight: "bold", color: "#fff" },
  email: { color: "#ccc" },
  noParticipants: { textAlign: "center", color: "#ccc", marginTop: 10 },
});
