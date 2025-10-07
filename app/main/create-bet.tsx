import { AuthContext } from "@/contexts/AuthContext";
import { BetContext } from "@/contexts/BetContext";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import DatetimePicker from '@react-native-community/datetimepicker';
import { decode } from "base64-arraybuffer";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CameraModal from "../components/CameraModal";

export default function CreateBetScreen() {
  const { createBet } = useContext(BetContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [commission, setCommission] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [endsAt, setEndsAt] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const uploadImage = async () => {
    if (!imageBase64) return null;

    if (!user) {
      console.log("⚠️ No user or no preview image selected to upload");
      return;
    }

    const folder = `${user.id}/`;
    const filename = `bet_${Date.now()}.jpg`;
    const relativePath = `${folder}${filename}`;
    const { error } = await supabase.storage
        .from("bets-images")
        .upload(relativePath, decode(imageBase64), {
            contentType: "image/jpeg",
        });

    if (error) throw error;

    const { data: publicData } = supabase.storage
        .from("bets-images")
        .getPublicUrl(relativePath);

    return publicData?.publicUrl || null;
};

  const handleCreateBet = async () => {
    if (!title.trim() || !description.trim() || !cost.trim() || !commission.trim()) {
        Alert.alert("Missing fields", "Please fill in all fields.");
        return;
    }

    // Validación de ends_at
    if (endsAt && endsAt <= new Date()) {
        Alert.alert("Invalid End Date", "The end date must be in the future.");
        return;
    }

    try {
        setLoading(true);
        const image_url = imageBase64 ? await uploadImage() : undefined;

        if (imageBase64 && !image_url) throw new Error("Image upload failed.");

        const costNumber = parseFloat(cost);
        const commissionNumber = parseFloat(commission);

        // Calculamos la comisión real del admin
        const adminCommission = (commissionNumber / 100) * costNumber; // ej: 10% de 50 = 5
        const userReceives = costNumber - adminCommission;

        await createBet({
            title,
            description,
            cost: costNumber,
            commission: adminCommission, // guardamos el valor real en DB
            image_url: image_url ?? undefined,
            ends_at: endsAt?.toISOString() || null,
            status: "ACTIVE", // por defecto
        });

        Alert.alert("✅ Success", `Bet created successfully! Admin: $${adminCommission}, User: $${userReceives}`);
        router.back();
    } catch (err: any) {
        console.error("Error creating bet:", err);
        Alert.alert("Error", err.message || "Something went wrong.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b266bff" translucent />

      {/* Círculos decorativos */}
      <View style={[styles.decorShape, styles.decorShapeTopRight]}>
        <LinearGradient
          colors={["#0d9c5c7b", "#293bad7b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: 60 }}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 110, paddingBottom: 80 }}>
        <Text style={styles.title}>🧠 Create a New Bet</Text>

        <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} multiline style={[styles.input, { height: 100 }]} />
        <TextInput placeholder="Cost" value={cost} onChangeText={setCost} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Commission (%)" value={commission} onChangeText={setCommission} keyboardType="numeric" style={styles.input} />

        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <LinearGradient colors={["#0d9c5cff", "#293badff"]} style={styles.buttonInner}>
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.buttonText}>{endsAt ? endsAt.toLocaleDateString() : "Select End Date"}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {imageBase64 && (
          <Image source={{ uri: `data:image/jpeg;base64,${imageBase64}` }} style={styles.previewImage} />
        )}

        {showDatePicker && (
          <DatetimePicker
            value={endsAt || new Date()}
            mode="datetime"
            display="default"
            onChange={(_, date) => {
              setShowDatePicker(false);
              if (date) setEndsAt(date);
              }}
          />
        )}

        <TouchableOpacity onPress={() => setShowCamera(true)} style={styles.uploadButton}>
          <LinearGradient colors={["#0d9c5cff", "#293badff"]} style={styles.buttonInner}>
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.buttonText}>Take / Select Image</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCreateBet} disabled={loading} style={styles.saveButton}>
          <LinearGradient colors={["#43e97b", "#38f9d7"]} style={styles.buttonInner}>
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.buttonText}>{loading ? "Saving..." : "Create Bet"}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <CameraModal
        isVisible={showCamera}
        onCancel={() => setShowCamera(false)}
        onConfirm={(url) => {
          // Aquí solo guardamos el base64 de preview (no subimos nada todavía)
          fetch(url)
              .then(res => res.blob())
              .then(blob => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                      const base64 = reader.result?.toString().split(',')[1] || null;
                      setImageBase64(base64);
                  };
                  reader.readAsDataURL(blob);
              })
              .finally(() => setShowCamera(false));
            }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b266bff", paddingHorizontal: 30 },
  decorShape: { position: "absolute", width: 140, height: 40, borderRadius: 60 },
  decorShapeTopRight: { top: 200, right: -40 },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 25, textAlign: "center" },
  input: {
    backgroundColor: "#2b3a7a",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 15,
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 15,
    marginBottom: 15,
  },
  uploadButton: { marginBottom: 15 },
  saveButton: { marginBottom: 30 },
  buttonInner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  datePickerButton: { marginBottom: 10 },
  datePickerText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8},
});
