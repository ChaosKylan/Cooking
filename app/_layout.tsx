import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { GlobalStateProvider } from "./lib/provider/GlobalState";
import { useEffect } from "react";
import { recipeSchema } from "./model/schema/recipe";
import ingredientSchema from "./model/schema/ingredient";
import SQliter from "./lib/data/sql";
import recipIngSchema from "./model/schema/recipeIngredientRel";
import { mealPlansSchema } from "./model/schema/mealPlan";
import { mealRecipRelSchema } from "./model/schema/mealPlanRecipeRel";
import { shoppingListSchema } from "./model/schema/shoppingList/shoppinglist";
import { shopListIngRelSchema } from "./model/schema/shoppingList/shopListIngRel";
import { ThemeProvider, useTheme } from "./lib/provider/themeContext";

export default function Layout() {
    useEffect(() => {
        3;
        preInitDB();
    }, []);
    return (
        <ThemeProvider>
            <GlobalStateProvider>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="screens/recipe/addRecipe"
                        options={{
                            headerShown: false,
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="screens/recipe/viewRecipe"
                        options={{
                            headerShown: false,
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="screens/mealPlan/addMealPlan"
                        options={{
                            headerShown: false,
                        }}
                    ></Stack.Screen>

                    <Stack.Screen
                        name="screens/mealPlan/addMealToPlan"
                        options={{
                            headerShown: false,
                        }}
                    ></Stack.Screen>

                    <Stack.Screen
                        name="screens/shoppingList/addIngredientsToList"
                        options={{
                            headerShown: false,
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
        // sql.executeSqlWihtout("Drop table if exists Recipes");
        // sql.executeSqlWihtout("Drop table if exists RecipIngRel");
        // sql.executeSqlWihtout("Drop table if exists Ingredients");
        //  sql.executeSqlWihtout("Drop table if exists Ingredients");
        // sql.executeSqlWihtout("Drop table if exists MealPlans");
        // sql.executeSqlWihtout("Drop table if exists MealRecipRelSchema");
        sql.createTable(recipeSchema);
        sql.createTable(ingredientSchema);
        sql.createTable(recipIngSchema);

        sql.createTable(mealPlansSchema);
        sql.createTable(mealRecipRelSchema);

        sql.createTable(shoppingListSchema);
        sql.createTable(shopListIngRelSchema);

        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}
