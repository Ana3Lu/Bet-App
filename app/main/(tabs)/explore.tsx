import { LinearGradient } from "expo-linear-gradient";
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b266bff" translucent />

      {/* Círculos decorativos */}
      <View style={[styles.decorShape, styles.decorShapeTopLeft]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} style={{ flex: 1, borderRadius: 60 }} />
      </View>
      <View style={[styles.decorShape, styles.decorShapeTopRight]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} style={{ flex: 1, borderRadius: 60 }} />
      </View>

      {/* Logo */}
      <Image source={require("../../../assets/images/Bety.png")} style={styles.logo} />

      {/* Contenido */}
      <Text style={styles.title}>🔍 Explore</Text>
      <Text style={styles.subtitle}>Discover new features</Text>
      <Text style={styles.paragraph}>• Trending bets and games</Text>
      <Text style={styles.paragraph}>• Suggested profiles to follow</Text>
      <Text style={styles.paragraph}>• Community challenges</Text>
      <Text style={styles.paragraph}>Explore new ways to enjoy Bety!</Text>

      {/* Card 1 */}
      <View style={styles.card}>
        <Image source={require("../../../assets/images/soccer.png")} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>⚽ Soccer Match</Text>
          <Text style={styles.cardSubtitle}>Join now and predict the winner!</Text>
          <TouchableOpacity style={[styles.cardButton, { backgroundColor: "#4facfe" }]}>
            <Text style={styles.cardButtonText}>Join Bet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card 2 */}
      <View style={styles.card}>
        <Image source={require("../../../assets/images/casino.png")} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>🎰 Casino Spin</Text>
          <Text style={styles.cardSubtitle}>Try your luck in the roulette!</Text>
          <TouchableOpacity style={[styles.cardButton, { backgroundColor: "#0d9c5c" }]}>
            <Text style={styles.cardButtonText}>Join Bet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, 
    backgroundColor: "#1b266bff", 
    paddingHorizontal: 30,
    paddingTop: 20
  },
  decorShape: { 
    position: "absolute", 
    width: 150, 
    height: 40, 
    borderRadius: 60 
  },
  decorShapeTopLeft: { 
    top: 80, 
    left: -40 
  },
decorShapeTopRight: { 
    top: 200, 
    right: -40 
  },
  logo: { 
    width: 85, 
    height: 85, 
    resizeMode: "contain", 
    marginBottom: 5,
    marginTop: 30, 
    alignSelf: "center"
  },
  title: { 
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 15 
  },
  subtitle: { 
    fontSize: 16, 
    color: "#ccc", 
    marginBottom: 10 
  },
  paragraph: { 
    fontSize: 14, 
    color: "#aaa",  
    marginLeft: 20,
    marginBottom: 5 
  },
  card: { 
    flexDirection: "row",
    backgroundColor: "#2b3a7a", 
    borderRadius: 15, 
    marginBottom: 10,
    marginTop: 10, 
    overflow: "hidden" 
  },
  cardImage: { 
    width: 90, 
    height: 90, 
    borderRadius: 20, 
    margin: 15 
  },
  cardContent: { 
    flex: 1, 
    padding: 10, 
    justifyContent: "center" 
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#fff" 
  },
  cardSubtitle: { 
    fontSize: 14, 
    color: "#ccc", 
    marginVertical: 5 
  },
  cardButton: { 
    alignSelf: "flex-start", 
    paddingVertical: 6, 
    paddingHorizontal: 15, 
    borderRadius: 20, 
    marginTop: 5 
  },
  cardButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  }
});
