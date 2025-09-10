import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
        source={require("../../assets/images/Bety.png")}
        style={styles.logo}
      />

      {/* Mensajes de bienvenida */}
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Hey! Good to see you again</Text>

      {/* Input Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#4facfe" style={styles.iconLeft} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
      </View>

      {/* Input Password */}
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons 
          name="lock-outline" 
          size={20} 
          color="#4facfe" 
          style={styles.iconLeft} 
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* Forgot Password & Remember Me */}
      <View style={styles.row}>
        <View style={styles.rememberRow}>
          <View style={styles.checkbox}>
            <Ionicons name="checkmark" size={14} color="#43e97b" />
          </View>
          <Text style={styles.remember}>Remember me</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/reset")}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.buttonWrapper} onPress={() => router.replace("/main/(tabs)")}>
        <LinearGradient
          colors={["#4facfe", "#43e97b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Social Accounts */}
      <Text style={styles.orText}>Or by social accounts</Text>
      <View style={styles.socialRow}>
        <TouchableOpacity style={[styles.socialButton]}>
          <FontAwesome name="facebook" size={15} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton]}>
          <FontAwesome name="google" size={15} color="#db4437" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton]}>
          <FontAwesome name="apple" size={15} color="black" />
        </TouchableOpacity>
      </View>

      {/* Sign Up */}
      <Text style={styles.bottomText}>
        Don’t have an account?{" "}
        <Text style={styles.signUp} onPress={() => router.push("/register")}>
          Sign Up
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
    width: 140,
    height: 40,
    borderRadius: 60
  },
  decorShapeTopLeft: {
    top: 60,
    left: -40,
  },
  decorShapeBottomRight: {
    bottom: 140,
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
    marginBottom: 25
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25
  },
  forgot: {
    color: "#43e97b",
    fontSize: 14,
    textDecorationLine: "underline",
    paddingHorizontal: 10
  },
  remember: {
    color: "#ccc",
    fontSize: 14,
    paddingHorizontal: 5
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    alignContent: "center"
  },
  checkbox: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: "transparent"
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 25
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
  orText: {
    color: "#aaa",
    marginBottom: 15,
    marginTop: 20
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 25
  },
  socialButton: {
    width: 35,
    height: 35,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 8,
    elevation: 3
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