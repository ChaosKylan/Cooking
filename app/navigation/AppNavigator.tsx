import { Stack } from "expo-router/stack";
import Recipes from "../(tabs)/recipes";
import AddRecipe from "../screens/addRecipe";
import ViewRecipe from "../screens/viewRecipe";

export default function AppNavigator() {
    return (
        <Stack>
            <Stack.Screen
                name={"(tabs)/recipes"}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="screens/addRecipe"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="screens/viewRecipe"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
