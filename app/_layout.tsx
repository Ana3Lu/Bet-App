import { AuthProvider } from "@/contexts/AuthContext";
import { BetProvider } from "@/contexts/BetContext";
import { DataProvider } from "@/contexts/DataContext";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <AuthProvider>
            <DataProvider>
                <BetProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false
                        }}
                    >
                        <Stack.Screen name="index" />
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="main/(tabs)" />
                    </Stack>
                </BetProvider>
            </DataProvider>
        </AuthProvider>
    )
}
