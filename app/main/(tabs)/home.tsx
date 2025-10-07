import { AuthContext } from "@/contexts/AuthContext";
import { BetContext } from "@/contexts/BetContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useContext, useEffect } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const { bets, participations, fetchBets, fetchParticipations } =
    useContext(BetContext);

  useEffect(() => {
    fetchBets();
    fetchParticipations();
  }, [fetchBets, fetchParticipations]);

  // Filtrar las apuestas en las que participa el usuario
  const activeUserBets =
    user?.role === "CLIENT"
      ? bets.filter(
          (bet) =>
            participations.includes(bet.id) && bet.status === "ACTIVE"
        )
      : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b266bff" translucent />

      {/* Decoraciones */}
      <View style={[styles.decorShape, styles.decorShapeTopLeft]}>
        <LinearGradient
          colors={["#0d9c5c7b", "#293bad7b"]}
          style={{ flex: 1, borderRadius: 60 }}
        />
      </View>
      <View style={[styles.decorShape, styles.decorShapeBottomRight]}>
        <LinearGradient
          colors={["#0d9c5c7b", "#293bad7b"]}
          style={{ flex: 1, borderRadius: 60 }}
        />
      </View>

      {/* Botón de notificaciones */}
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => router.replace("../notifications")}
      >
        <LinearGradient colors={["#0d9c5cff", "#293badff"]} style={styles.editCircle}>
          <Ionicons name="notifications" size={22} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Botón de configuración */}
      <TouchableOpacity
        style={styles.configButton}
        onPress={() => router.replace("../settings")}
      >
        <LinearGradient colors={["#0d9c5cff", "#293badff"]} style={styles.editCircle}>
          <Ionicons name="cog" size={22} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require("../../../assets/images/Bety.png")}
        style={styles.logo}
      />

      {/* Contenido principal */}
      <Text style={styles.title}>🏠 Home</Text>
      <Text style={styles.subtitle}>
        <Text style={{ fontWeight: "bold" }}>Bety!</Text> The best hub for recreational betting.
      </Text>
      <Text style={styles.paragraph}>
        Track your activity, explore features, and stay updated with the latest news inside the app.
      </Text>

      {/* Si es player (CLIENT), mostrar sus apuestas */}
      {user?.role === "CLIENT" && (
        <View style={{ width: "100%", marginTop: 10 }}>
          <Text style={styles.sectionTitle}>🎯 Your Active Bets</Text>

          {activeUserBets.length === 0 ? (
          <View style={styles.emptyAnimationContainer}>
            {/* Animación Lottie */}
            <LottieView
              source={require("../../../assets/animations/No data Found.json")}
              autoPlay
              loop
              style={{ width: 70, height: 70, backgroundColor: "#fff", borderRadius: 40 }}
            />
            <Text style={styles.emptyText}>You have no active bets yet.</Text>
          </View>
        ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginVertical: 10 }}
            >
              {activeUserBets.map((bet) => (
                <View key={bet.id} style={styles.betCard}>
                  {bet.image_url && (
                    <Image source={{ uri: bet.image_url }} style={styles.betImage} />
                  )}
                  <Text style={styles.betTitle}>{bet.title}</Text>
                  <Text style={styles.betDescription}>{bet.description}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Botones normales de acceso */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#4facfe" }]}
        onPress={() => router.push("../explore")}
      >
        <Text style={styles.buttonText}>🎯 Explore 🎯</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#0d9a9cff" }]}
      >
        <Text style={styles.buttonText}>📊 My Statistics 📊</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#b243e9ff" }]}
      >
        <Text style={styles.buttonText}>🏆 Leaderboard 🏆</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#1b266bff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30
  },
  decorShape: {
    position: "absolute",
    width: 150,
    height: 40,
    borderRadius: 60
  },
  decorShapeTopLeft: {
    top: 80,
    left: -40,
  },
  decorShapeBottomRight: {
    bottom: 10,
    right: -40,
  },
  logo: {
    width: 85,
    height: 85,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 25
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 15
  },
  paragraph: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 10
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5
  },
  emptyText: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 15,
  },
  betCard: {
    backgroundColor: "#2b3a7a",
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
    width: 140,
  },
  betImage: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    marginBottom: 8,
  },
  betTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  betDescription: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 2,
  },
  button: { 
    width: "100%", 
    paddingVertical: 14, 
    borderRadius: 25, 
    alignItems: "center", 
    marginBottom: 10 
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  configButton: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  notificationButton: {
    position: "absolute",
    top: 50,
    right: 70,
  },
  editCircle: {
    width: 40,
    height: 40,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyAnimationContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  }
});
