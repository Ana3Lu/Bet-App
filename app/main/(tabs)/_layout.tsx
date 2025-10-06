import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

export default function TabLayout() {

  const { user } = useContext(AuthContext);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,          
        tabBarActiveTintColor: "#4facfe",
        tabBarInactiveTintColor: "#aaa",
        tabBarStyle: {
          backgroundColor: "#1b266bff",
          borderTopWidth: 0,
          elevation: 0
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="comment" size={22} color={color} />
          ),
        }}
      />
      {/* Según rol */}
      {user?.role === "CLIENT" && (
        <Tabs.Screen
          name="bet-client"
          options={{
            title: "Bets",
            tabBarIcon: ({ color }) => (
              <Ionicons name="trophy" size={22} color={color} />
            ),
          }}
        />
      )}
      {user?.role === "ADMIN" && (
        <Tabs.Screen
          name="bet-admin"
          options={{
            title: "Bets",
            tabBarIcon: ({ color }) => (
              <Ionicons name="trophy" size={22} color={color} />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color }) => (
            <Ionicons name="wallet" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
