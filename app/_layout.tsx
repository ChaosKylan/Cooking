import { Stack } from "expo-router/stack";
import { ThemeProvider } from "./lib/provider/themeContext";
import { StatusBar } from "expo-status-bar";
import { GlobalStateProvider } from "./lib/provider/GlobalState";
import { useEffect } from "react";
import {
    recipeSchema,
    ingredientSchema,
    recipIngSchema,
} from "./model/recipeModel";
import SQliter from "./lib/data/sql";

export default function Layout() {
    useEffect(() => {
        preInitDB();
    }, []);

    return (
        <ThemeProvider>
            <GlobalStateProvider>
                <StatusBar style="auto" />
                <Stack>
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
                    <Stack.Screen
                        name="screens/viewRecipe"
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
function preInitDB() {
    try {
        var sql = SQliter.connection();
        sql.createTable(recipeSchema);
        sql.createTable(ingredientSchema);
        sql.createTable(recipIngSchema);
        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}
