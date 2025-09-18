import { AuthContext } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function EditProfileScreen() {
  const { user, updateProfile } = useContext(AuthContext);
  const router = useRouter();

  // Estados locales para editar
  const [username, setUsername] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "");

  const handleSave = async () => {
    await updateProfile({
      name: username,
      bio,
      phone,
      gender,
    });
    router.back(); // volver a ProfileScreen
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b266bff" translucent />

      {/* Círculos decorativos */}
      <View style={[styles.decorShape, styles.decorShapeTopLeft]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} style={styles.circleGradient} />
      </View>
      <View style={[styles.decorShape, styles.decorShapeBottomRight]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} style={styles.circleGradient} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.sectionTitle}>✏️ Edit Profile</Text>

        {/* Username */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />

        {/* Bio */}
        <TextInput
          style={styles.input}
          placeholder="Bio"
          placeholderTextColor="#aaa"
          value={bio}
          onChangeText={setBio}
        />

        {/* Phone */}
        <TextInput
          style={styles.input}
          placeholder="Phone"
          placeholderTextColor="#aaa"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Gender */}
        <TextInput
          style={styles.input}
          placeholder="Gender"
          placeholderTextColor="#aaa"
          value={gender}
          onChangeText={setGender}
        />

        {/* Save Button */}
        <TouchableOpacity style={[styles.button, { backgroundColor: "#43e97b" }]} onPress={handleSave}>
          <Text style={styles.buttonText}>💾 Save</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#e94e4e" }]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>❌ Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#1b266bff",
    paddingHorizontal: 30,
    paddingTop: 100,
  },
  decorShape: { 
    position: "absolute", 
    width: 170, 
    height: 40, 
    borderRadius: 60 
  },
  decorShapeTopLeft: { 
    top: 60, 
    left: -40 
  },
  decorShapeBottomRight: { 
    bottom: 30, 
    right: -40 
  },
  circleGradient: { 
    flex: 1, 
    borderRadius: 60 
  },
  sectionTitle: { 
    fontSize: 25, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 20,
    textAlign: "center"
  },
  input: {
    backgroundColor: "#2c2f7c",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: "#fff",
    marginBottom: 15,
    fontSize: 16
  },
  button: { 
    marginTop: 10, 
    paddingVertical: 14, 
    borderRadius: 25, 
    alignItems: "center" 
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  }
});