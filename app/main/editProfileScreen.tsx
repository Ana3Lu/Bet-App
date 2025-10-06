import { AuthContext } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import CameraModal from "../components/CameraModal";

export default function EditProfileScreen() {
  const { user, updateProfile } = useContext(AuthContext);
  const router = useRouter();
  const context = useContext(AuthContext);

  // Local states
  const [username, setUsername] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "");

  const [showCamera, setShowCamera] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b266bff" translucent />

      {/* Círculos decorativos */}
      <View style={[styles.decorShape, styles.decorShapeTopLeft]}>
        <LinearGradient
          colors={["#0d9c5c7b", "#293bad7b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: 60 }}
        />
      </View>
      <View style={[styles.decorShape, styles.decorShapeTopRight]}>
        <LinearGradient
          colors={["#0d9c5c7b", "#293bad7b"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={{ flex: 1, borderRadius: 60 }}
        />
      </View>

      <Text style={styles.sectionTitle}><Ionicons name="pencil" size={24} color="white" /><Ionicons name="person-circle-outline" size={24} color="white" /> Edit Profile</Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={
            selectedImage
              ? { uri: selectedImage } // Recent selected image
              : context.user?.avatar_url
              ? { uri: context.user.avatar_url } // Avatar saved in Supabase
              : require("../../assets/images/avatar.png") // Fallback
          }
          style={styles.avatar}
        />

        {/* Botón de edición (pencil) */}
        <TouchableOpacity style={styles.editButton} onPress={() => setShowCamera(true)}>
          <LinearGradient colors={["#0d9c5cff", "#293badff"]} style={styles.editCircle}>
            <Ionicons name="pencil" size={18} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

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
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#0d9a9cff" }]}
        onPress={async () => {
          await updateProfile({
            name: username,
            bio,
            phone,
            gender,
            avatar_url: selectedImage ?? context.user?.avatar_url
          });
          router.replace("/main/(tabs)/profile");
        }}
      >
      <Text style={styles.buttonText}>💾 Save</Text>
    </TouchableOpacity>


      {/* Cancel Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#dc8e59ff" }]}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>❌ Cancel</Text>
      </TouchableOpacity>

      <CameraModal
        isVisible={showCamera}
        onCancel={() => setShowCamera(false)}
        onConfirm={async (publicUrl) => {
          setSelectedImage(publicUrl);
          setShowCamera(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#1b266bff",
    paddingHorizontal: 30,
    paddingTop: 90,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 60,
    padding: 6, 
    backgroundColor: "#38748661", 
    marginHorizontal: 95
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 3,
    marginTop: 10,
    marginBottom: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  editButton: {
    position: "absolute",
    bottom: -5,
    right: 0,
  },
  editCircle: {
    width: 40,
    height: 40,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  decorShape: { 
    position: "absolute", 
    width: 140, 
    height: 40, 
    borderRadius: 60 
  },
  decorShapeTopLeft: { 
    top: 150, 
    left: -40 
  },
  decorShapeTopRight: { 
    top: 215, 
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
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.6)",
  justifyContent: "center",
  alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#2c2f7c",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  modalButton: {
    width: "100%",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#0d9a9cff",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  }
});