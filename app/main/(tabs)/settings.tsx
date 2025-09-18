import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b266bff" translucent />

      {/* Decoración */}
      <View style={[styles.decorShape, styles.decorShapeTopLeft]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} style={styles.circleGradient} />
      </View>
      <View style={[styles.decorShape, styles.decorShapeBottomRight]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} style={styles.circleGradient} />
      </View>

      <Text style={styles.title}><Ionicons name="settings-outline" size={30} color="white" /> Settings</Text>
      <Text style={styles.subtitle}>Configure your preferences</Text>

      {/* Items */}
      <TouchableOpacity style={styles.item}>
        <FontAwesome name="lock" size={20} color="#4facfe" />
        <Text style={styles.itemText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <FontAwesome name="bell" size={18} color="#aeca23ff" />
        <Text style={styles.itemText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <FontAwesome name="globe" size={20} color="#4facfe" />
        <Text style={styles.itemText}>
            <Text style={{ fontWeight: "bold", marginRight: 5 }}>
                Language:
            </Text>
            English
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <FontAwesome name="moon-o" size={20} color="#ccc" />
        <Text style={styles.itemText}>
            <Text style={{ fontWeight: "bold", marginRight: 5 }}>
                Dark Mode: 
            </Text>
            Enabled
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#1b266bff", 
    padding: 30 
  },
  decorShape: { 
    position: "absolute", 
    width: 200, 
    height: 40, 
    borderRadius: 60 
  },
  decorShapeTopLeft: { 
    top: 80, 
    left: -40 
  },
  decorShapeBottomRight: { 
    bottom: 110, 
    right: -40  
  },
  circleGradient: { 
    flex: 1, 
    borderRadius: 60 
  },
  title: { 
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#fff", 
    marginTop: 130, 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 14, 
    color: "#ccc", 
    marginBottom: 20  
  },
  item: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 12,
    marginLeft: 30, 
  },
  itemText: { 
    fontSize: 16, 
    color: "#fff", 
    marginLeft: 10 
  }
});
