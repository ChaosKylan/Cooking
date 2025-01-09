import { Stack } from "expo-router/stack";
import Recipes from "../(tabs)/recipes";
import AddRecipe from "../screens/addRecipe";

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
        </Stack>
    );
}
