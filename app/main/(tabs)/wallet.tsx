import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, StatusBar, StyleSheet, Text, View } from "react-native";

// Tipos para evitar los errores de TS
interface Bet {
  title: string;
  commission: number;
}
interface Participation {
  amount: number;
  status: "PENDING" | "WON" | "LOST";
}

export default function WalletScreen() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState<(Bet | Participation)[]>([]);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    const fetchWallet = async () => {
      if (user.role === "CLIENT") {
        const { data, error } = await supabase
          .from("bets_participations")
          .select("amount, status")
          .eq("player_id", user.id);

        if (!error && data) {
          const total = data.reduce(
            (acc: number, b: Participation) =>
              b.status === "WON" ? acc + Number(b.amount) : acc,
            0
          );
          setBalance(total);
          setTransactions(data);
        }
      } else if (user.role === "ADMIN") {
        const { data, error } = await supabase
          .from("bets")
          .select("commission, title")
          .eq("created_by", user.id);

        if (!error && data) {
          const total = data.reduce(
            (acc: number, b: Bet) => acc + Number(b.commission || 0),
            0
          );
          setBalance(total);
          setTransactions(data);
        }
      }
    };
    fetchWallet();
  }, [user]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b266bff" translucent={true} />

      {/* Círculos decorativos */}
      <View style={[styles.decorShape, styles.decorShapeTopLeft]}>
        <LinearGradient
          colors={["#0d9c5c7b", "#293bad7b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: 60 }}
        />
      </View>
      <View style={[styles.decorShape, styles.decorShapeBottomRight]}>
        <LinearGradient
          colors={["#0d9c5c7b", "#293bad7b"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={{ flex: 1, borderRadius: 60 }}
        />
      </View>

      {/* Logo */}
      <Image
        source={require("../../../assets/images/Bety.png")}
        style={styles.logo}
      />

      <Text style={styles.title}><Ionicons name="wallet" size={24} color="white" /> Wallet</Text>
      <Text style={styles.subtitle}>Your current balance:</Text>
      <Text style={styles.balance}>${balance.toFixed(2)}</Text>

      <FlatList
        data={transactions}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {"status" in item ? item.status : item.title}
            </Text>
            <Text style={styles.cardAmount}>
              ${"amount" in item ? item.amount : item.commission}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions yet 💸</Text>
        }
        style={{ width: "100%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b266bff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 100,
  },
  decorShape: {
    position: "absolute",
    width: 150,
    height: 40,
    borderRadius: 60,
  },
  decorShapeTopLeft: { top: 90, left: -40 },
  decorShapeBottomRight: { top: 290, right: -40 },
  logo: { width: 85, height: 85, resizeMode: "contain", marginBottom: 10 },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#ccc", marginBottom: 8 },
  balance: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#dc8e59ff",
    marginBottom: 35,
  },
  card: {
    backgroundColor: "#1c2458",
    padding: 15,
    borderRadius: 20,
    marginBottom: 12,
  },
  cardTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cardAmount: { color: "#aaa", marginTop: 4, fontSize: 14 },
  emptyText: { color: "#888", marginTop: 20 },
});