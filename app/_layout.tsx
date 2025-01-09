import { Stack } from "expo-router/stack";
import { ThemeProvider } from "./lib/provider/themeContext";
import { StatusBar } from "expo-status-bar";
import { GlobalStateProvider } from "./lib/provider/GlobalState";

export default function Layout() {
    return (
        <ThemeProvider>
            <GlobalStateProvider>
                <Stack>
                    <StatusBar style="light" />
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="screens/addRecipe"
                        options={{
                            headerShown: false,
                            // headerTitle: "Recipe",
                            // headerTitleAlign: "center",
                        }}
                    ></Stack.Screen>
                </Stack>
            </GlobalStateProvider>
        </ThemeProvider>
    );
}
