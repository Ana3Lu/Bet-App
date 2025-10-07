import { Bet, BetContext } from "@/contexts/BetContext";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditBetScreen() {
  const router = useRouter();
  const { betId } = useLocalSearchParams<{ betId: string }>();
  const { bets, editBet } = useContext(BetContext);

  const [bet, setBet] = useState<Bet | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [commission, setCommission] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "CLOSED">("ACTIVE");

  useEffect(() => {
    const currentBet = bets.find(b => b.id === betId) || null;
    if (currentBet) {
      setBet(currentBet);
      setTitle(currentBet.title);
      setDescription(currentBet.description);
      setCost(String(currentBet.cost));
      setCommission(String(currentBet.commission));
      setImageUrl(currentBet.image_url || "");
      setEndsAt(currentBet.ends_at ? currentBet.ends_at.slice(0,16) : ""); // formato yyyy-mm-ddThh:mm
      setStatus(currentBet.status);
    }
  }, [bets, betId]);

  const handleSave = async () => {
    if (!bet || !editBet) return;

    await editBet(bet.id, {
      title,
      description,
      cost: Number(cost),
      commission: Number(commission),
      image_url: imageUrl || undefined,
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      status,
    });

    router.back();
  };

  if (!bet) return <Text style={{ color: "#fff" }}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b266bff" translucent />

      <View style={[styles.decorShape, styles.decorShapeTopLeft]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} style={{ flex: 1, borderRadius: 60 }} />
      </View>
      <View style={[styles.decorShape, styles.decorShapeTopRight]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} style={{ flex: 1, borderRadius: 60 }} />
      </View>

      {/* Header */}
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>✏️ Edit Bet</Text>

      <ScrollView style={{ marginTop: 10 }}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Description</Text>
        <TextInput style={styles.input} value={description} onChangeText={setDescription} />

        <Text style={styles.label}>Cost</Text>
        <TextInput style={styles.input} value={cost} onChangeText={setCost} keyboardType="numeric" />

        <Text style={styles.label}>Commission</Text>
        <TextInput style={styles.input} value={commission} onChangeText={setCommission} keyboardType="numeric" />

        <Text style={styles.label}>Image URL</Text>
        <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} />

        <Text style={styles.label}>Ends At</Text>
        <TextInput style={styles.input} value={endsAt} onChangeText={setEndsAt} placeholder="YYYY-MM-DDTHH:MM" />

        <Text style={styles.label}>Status</Text>
        <Picker selectedValue={status} onValueChange={(val) => setStatus(val as "ACTIVE" | "CLOSED")} style={{color:"#fff", backgroundColor:"#2b3a7a", marginTop:5}}>
          <Picker.Item label="Active" value="ACTIVE" />
          <Picker.Item label="Closed" value="CLOSED" />
        </Picker>

        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <LinearGradient colors={["#43e97b", "#38f9d7"]} style={styles.circleButton}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b266bff", paddingHorizontal: 30, paddingTop: 70 },
  decorShape: { position: "absolute", width: 140, height: 40, borderRadius: 60 },
  decorShapeTopLeft: { top: 70, left: -40 },
  decorShapeTopRight: { top: 70, right: -40 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 10, textAlign: "center" },
  logo: { width: 85, height: 85, resizeMode: "contain", marginBottom: 10, alignSelf: "center" },
  label: { color: "#fff", marginTop: 10, fontWeight: "bold" },
  input: { backgroundColor: "#2b3a7a", color: "#fff", borderRadius: 10, padding: 10, marginTop: 5 },
  saveButton: { marginTop: 20, alignItems: "center" },
  circleButton: { paddingVertical: 10, paddingHorizontal: 40, borderRadius: 25, justifyContent: "center", alignItems: "center" },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20
  }
});
