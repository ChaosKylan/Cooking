import { Stack } from "expo-router/stack";

export default function AppNavigator() {
    return (
        <Stack>
            <Stack.Screen
                name={"(tabs)/recipes"}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="screens/recipe/addRecipe"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="screens/recipe/viewRecipe"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="screens/mealPlan/addMealPlan"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="screens/mealPlan/addMealToPlan"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="screens/shoppingList/addIngredientsToList"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
