import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, StatusBar, StyleSheet, Text, View } from "react-native";

// Tipos para los datos que manejaremos
interface Transaction {
  id?: number;
  amount: number;
  status?: "PENDING" | "WON" | "LOST"; // solo CLIENT
  bet_title?: string;                   // solo CLIENT
  title?: string;                       // solo ADMIN
  commission?: number;                  // solo ADMIN
}

export default function WalletScreen() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    const fetchWallet = async () => {
      if (user.role === "CLIENT") {
        const { data, error } = await supabase
          .from("bets_participations")
          .select("id, amount, status, bet_id(title)")
          .eq("player_id", user.id);

        if (!error && data) {
          const transformed = data.map((p: any) => ({
            id: p.id,
            amount: p.amount,
            status: p.status,
            bet_title: p.bet_id?.title || "Bet Participation",
          }));
          setTransactions(transformed);

          const total = transformed.reduce((acc, t) => {
            if (t.status === "WON") return acc + Number(t.amount);
            if (t.status === "LOST") return acc - Number(t.amount);
            return acc;
          }, 0);
          setBalance(total);
        }
      } else if (user.role === "ADMIN") {
        const { data, error } = await supabase
          .from("bets")
          .select("id, title, commission")
          .eq("created_by", user.id);

        if (!error && data) {
          // Mapeamos para que encaje con Transaction
          const transformed = data.map((b: any) => ({
            id: b.id,
            title: b.title,
            commission: b.commission,
            amount: b.commission, // para cumplir Transaction
          }));
          setTransactions(transformed);

          const total = transformed.reduce((acc, t) => acc + Number(t.amount || 0), 0);
          setBalance(total);
        }
      }
    };

    fetchWallet();
  }, [user]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b266bff" translucent />

      {/* Fondo decorativo */}
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
      <Image source={require("../../../assets/images/Bety.png")} style={styles.logo} />

      {/* Tarjeta de saldo */}
      <LinearGradient colors={["#4facfe", "#00fea9bf"]} style={styles.balanceCard}>
        <Ionicons name="wallet" size={28} color="#fff" />
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.balanceCardTitle}>💳 Current Balance</Text>
          <Text style={styles.balanceCardAmount}>${balance.toFixed(2)}</Text>
        </View>
      </LinearGradient>

      {/* Historial */}
      <Text style={styles.historyTitle}>🏷 {user?.role === "CLIENT" ? "Participation History" : "Your Bets Commissions"}</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            {/* Diferenciamos CLIENT y ADMIN */}
            <Text style={styles.transactionTitle}>
              {user?.role === "CLIENT" ? item.bet_title : item.title}
            </Text>
            <Text
              style={[
                styles.transactionAmount,
                user?.role === "CLIENT"
                  ? item.status === "WON"
                    ? { color: "green" }
                    : item.status === "LOST"
                    ? { color: "red" }
                    : { color: "#aaa" }
                  : { color: "#f6ac5cff" }, // ADMIN color para comisión
              ]}
            >
              {user?.role === "CLIENT"
                ? `${item.status === "WON" ? "+" : item.status === "LOST" ? "-" : ""}$${item.amount?.toFixed(2)}`
                : `$${item.commission?.toFixed(2)}`}
            </Text>
            {user?.role === "CLIENT" && (
              <Text style={styles.transactionStatus}>{item.status}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet 💸</Text>}
        style={{ width: "100%", marginTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b266bff", alignItems: "center", paddingHorizontal: 25, paddingTop: 50 },
  decorShape: { position: "absolute", width: 150, height: 40, borderRadius: 60 },
  decorShapeTopLeft: { top: 70, left: -40 },
  decorShapeBottomRight: { top: 255, right: -40 },
  logo: { width: 85, height: 85, resizeMode: "contain", marginBottom: 10 },
  balanceCard: { flexDirection: "row", alignItems: "center", padding: 20, borderRadius: 20, width: "100%", marginBottom: 20 },
  balanceCardTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  balanceCardAmount: { color: "#ffffffff", fontSize: 28, fontWeight: "bold", marginTop: 5 },
  historyTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", alignSelf: "flex-start", marginBottom: 10 },
  transactionCard: { backgroundColor: "#1c2458", padding: 15, borderRadius: 12, marginBottom: 12 },
  transactionTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  transactionAmount: { marginTop: 4, fontSize: 14 },
  transactionStatus: { color: "#aaa", fontSize: 12, marginTop: 2 },
  emptyText: { color: "#888", textAlign: "center", marginTop: 20, fontSize: 14 },
});
