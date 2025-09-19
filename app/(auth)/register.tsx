import { AuthContext } from "@/contexts/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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

export default function RegisterScreen() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const context = useContext(AuthContext);

  const handleRegister = async () => {
    console.log(">>> Register:", { name, email, password });
      const ok = await context.register(name.trim(), email.trim(), password.trim());

    if (ok) {
      console.log("✅ Registration successful, go to login");
      router.replace("/login");
    } else {
      console.log("❌ Registration failed");
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b266bff" translucent />

      {/* Círculos decorativos */}
      <View style={[styles.decorShape, styles.decorShapeBottomLeft]}>
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

      {/* Logo */}
      <Image source={require("../../assets/images/Bety.png")} style={styles.logo} />

      {/* Título */}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color="#4facfe" style={styles.iconLeft} />
        <TextInput
          placeholder="Name"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#4facfe" style={styles.iconLeft} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={20} color="#4facfe" style={styles.iconLeft} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Botón */}
      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={handleRegister}
        disabled={context.isLoading}
      >
        <LinearGradient
          colors={["#4facfe", "#43e97b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, context.isLoading && { opacity: 0.6 }]}
        >
          <Text style={styles.buttonText}>
            {context.isLoading ? "Registering..." : "Register"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Volver al login */}
      <Text style={styles.bottomText}>
        Already have an account?{" "}
        <Text style={styles.signUp} onPress={() => router.push("/login")}>
          Sign In
        </Text>
      </Text>
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
    width: 130,
    height: 40,
    borderRadius: 60
  },
  decorShapeBottomLeft: {
    bottom: 120,
    left: -30,
  },
  decorShapeTopRight: {
    top: 70,
    right: -30,
  },
  logo: {
    width: 85,
    height: 85,
    resizeMode: "contain"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 30
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2c2f7c",
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
    width: "100%"
  },
  input: {
    flex: 1,
    padding: 12,
    color: "#fff"
  },
  iconLeft: {
    marginRight: 10
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 90,
    marginTop: 10
  },
  button: {
    padding: 15,
    borderRadius: 20,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  bottomText: {
    color: "#fff",
    fontSize: 14
  },
  signUp: {
    color: "#4facfe",
    fontWeight: "bold",
    textDecorationLine: "underline"
  }
});