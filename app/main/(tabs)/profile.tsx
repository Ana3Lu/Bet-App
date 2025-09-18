import { AuthContext } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {

  const router = useRouter();

  const context = useContext(AuthContext);

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

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={require("../../../assets/images/avatar.png")} style={styles.avatar} />
      </View>

      {/* User info */}
      <Text style={styles.sectionTitle}>👤 User Information</Text>
      
      <Text style={styles.userLabel}>
        Username: <Text style={styles.userValue}>{context.user?.name}</Text>
      </Text>
      <Text style={styles.userLabel}>
        Email: <Text style={styles.userValue}>{context.user?.email}</Text>
      </Text>
      <Text style={styles.userLabel}>
        Bio: <Text style={styles.userValue}>{context.user?.bio ?? "—"}</Text>
      </Text>
      <Text style={styles.userLabel}>
        Phone: <Text style={styles.userValue}>{context.user?.phone ?? "—"}</Text>
      </Text>
      <Text style={styles.userLabel}>
        Gender: <Text style={styles.userValue}>{context.user?.gender ?? "—"}</Text>
      </Text>
      <Text style={styles.userLabel}>
        Points: <Text style={styles.userValue}>{context.user?.points ?? 0}</Text>
      </Text>

      {/* Actions */}
      <TouchableOpacity style={[styles.button, { backgroundColor: "#4facfe" }]}>
        <Text style={styles.buttonText} onPress={() => router.push("/main/editProfileScreen")}>✏️ Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: "#5c43e9ff" }]} 
        onPress={() => {
          context.logout();
          router.replace("/login");
        }}
      >
        <Text style={styles.buttonText}>🚪 Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#1b266bff",
     paddingHorizontal: 30 
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
  avatarContainer: { 
    alignItems: "center", 
    marginTop: 120, 
    marginBottom: 20, 
    borderRadius: 60, 
    padding: 5, 
    backgroundColor: "#38748661", 
    marginHorizontal: 100 
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50 
  },
  sectionTitle: { 
    fontSize: 25, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 15 
  },
  userLabel: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#ccc", 
    marginBottom: 10,
    marginLeft: 20
  },
  userValue: { 
    fontWeight: "normal", 
    color: "#fff" 
  },
  button: { 
    marginTop: 20, 
    paddingVertical: 12, 
    borderRadius: 25, 
    alignItems: "center" 
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  }
});
