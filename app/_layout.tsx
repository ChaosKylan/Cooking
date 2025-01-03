import { Stack } from "expo-router/stack";
import { ThemeProvider } from "./lib/provider/themeContext";

export default function Layout() {
    return (
        <ThemeProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="screens/addRecipe"
                    options={{
                        headerShown: false,
                        // headerTitle: "Recipe",
                        // headerTitleAlign: "center",
                    }}
                ></Stack.Screen>
            </Stack>
        </ThemeProvider>
    );
}
