import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function ResetScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b266bff" translucent />

      {/* Círculos decorativos */}
      <View style={[styles.decorShape, styles.decorShapeBottomLeft]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 60 }} />
      </View>
      <View style={[styles.decorShape, styles.decorShapeTopRight]}>
        <LinearGradient colors={["#0d9c5c7b", "#293bad7b"]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={{ flex: 1, borderRadius: 60 }} />
      </View>

      {/* Logo */}
      <Image source={require("../../assets/images/Bety.png")} style={styles.logo} />

      {/* Título */}
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive reset link</Text>

      {/* Input Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#4facfe" style={styles.iconLeft} />
        <TextInput placeholder="Email" placeholderTextColor="#aaa" style={styles.input} />
      </View>

      {/* Botón */}
      <TouchableOpacity style={styles.buttonWrapper} onPress={() => router.push("/login")}>
        <LinearGradient colors={["#4facfe", "#43e97b"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.bottomText} onPress={() => router.push("/login")}>
        Back to <Text style={styles.signUp}>Sign In</Text>
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
    width: 170,
    height: 40,
    borderRadius: 60
  },
  decorShapeBottomLeft: {
    bottom: 170,
    left: -40,
  },
  decorShapeTopRight: {
    top: 60,
    right: -40,
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
    marginBottom: 140,
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