import { AuthContext } from "@/contexts/AuthContext";
import { pickImage, takePhoto, uploadAvatar } from "@/utils/uploadImage";
import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Image,
  Modal,
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

  // Local states
  const [username, setUsername] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "");

  const [showImageOptions, setShowImageOptions] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  if (!permission) {
  // hook is still loading
  return <View />;
}

if (!permission.granted) {
  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>We need camera permission to continue</Text>
      <TouchableOpacity onPress={requestPermission}>
        <Text style={{ color: "cyan" }}>Grant Permission</Text>
      </TouchableOpacity>
    </View>
  );
}

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      await handleUpload(uri);
    }
    setShowImageOptions(false);
  };

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      await handleUpload(uri);
    }
    setShowImageOptions(false);
  };

  const handleUpload = async (uri: string) => {
    if (!user?.id) return;
    const publicUrl = await uploadAvatar(uri, user.id);
    if (publicUrl) {
      setSelectedImage(uri);
      await updateProfile({ avatar_url: publicUrl });
    }
  };

  const handleSave = async () => {
    await updateProfile({
      name: username,
      bio,
      phone,
      gender,
    });
    router.push("/main/(tabs)/profile"); // volver a ProfileScreen
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
        <Text style={styles.sectionTitle}><Ionicons name="pencil" size={24} color="white" /><Ionicons name="person-circle-outline" size={24} color="white" /> Edit Profile</Text>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={() => setShowImageOptions(true)}>
            <Image
              source={selectedImage ? { uri: selectedImage } : require("../../../assets/images/avatar.png")}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        <Modal
          visible={showImageOptions}
          transparent
          animationType="slide"
          onRequestClose={() => setShowImageOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Update Avatar</Text>

              <TouchableOpacity style={styles.modalButton} onPress={handleTakePhoto}>
                <Text style={styles.modalButtonText}>📸 Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalButton} onPress={handlePickImage}>
                <Text style={styles.modalButtonText}>🖼️ Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#dc5990ff" }]}
                onPress={() => setShowImageOptions(false)}
              >
                <Text style={styles.modalButtonText}>❌ Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
        <TouchableOpacity style={[styles.button, { backgroundColor: "#0d9a9cff" }]} onPress={handleSave}>
          <Text style={styles.buttonText}>💾 Save</Text>
        </TouchableOpacity>

        {/* Toggle Camera Facing Button */}
        <CameraView style={{ flex: 1 }} facing={facing} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: "#0d9a9cff" }]} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}><Ionicons name="camera-reverse-outline" size={24} color="white" /> Flip Camera</Text>
          </TouchableOpacity>
        </View>


        {/* Cancel Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#dc5990ff" }]}
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
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 60,
  },
  avatar: {
    width: 120,
    height: 120,
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
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
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
    marginTop: 20,
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