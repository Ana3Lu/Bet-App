import { LinearGradient } from "expo-linear-gradient";
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#1b266bff" 
        translucent={true}
      />

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

      {/* Contenido */}
      <Text style={styles.title}>🏠 Home</Text>
      <Text style={styles.subtitle}><Text style={{ fontWeight: "bold" }}>Bety!</Text> Your favorite hub for recreational betting.</Text>
      <Text style={styles.paragraph}>
        Track your activity, explore features, and stay updated with the latest news inside the app.
      </Text>

      {/* Accesos rápidos */}
      <TouchableOpacity style={[styles.button, { backgroundColor: "#4facfe" }]}>
        <Text style={styles.buttonText}>⚡ Quick Bet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: "#0d9c5c" }]}>
        <Text style={styles.buttonText}>📊 My Statistics</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: "#5c43e9ff" }]}>
        <Text style={styles.buttonText}>🏆 Leaderboard</Text>
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
    top: 130,
    left: -40,
  },
  decorShapeBottomRight: {
    bottom: 30,
    right: -40,
  },
  logo: {
    width: 85,
    height: 85,
    resizeMode: "contain",
    marginBottom: 10
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 15
  },
  paragraph: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 40
  }, 
  button: { 
    width: "100%", 
    paddingVertical: 14, 
    borderRadius: 25, 
    alignItems: "center", 
    marginBottom: 15 
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  }
});