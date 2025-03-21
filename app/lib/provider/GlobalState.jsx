import React, { createContext, useState, useEffect } from "react";
import SQliter from "../data/sql";
import { recipeSchema } from "../../model/schema/recipe";
import ingredientSchema from "../../model/schema/ingredient";
import { shoppingListSchema } from "@/app/model/schema/shoppingList/shoppinglist";

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    var db = SQliter.connection();
    const [recipeList, setRecipeList] = useState([]);
    const [ingredientList, setIngredientList] = useState([]);
    const [isShoppingListUpdated, setisShoppingListUpdated] = useState([true]);
    const [isMealPlanUpdated, setIsMealPlanUpdated] = useState([true]);

    useEffect(() => {
        const recipes = db.findAll(recipeSchema);

        setRecipeList(recipes || []);
    }, []);

    useEffect(() => {
        const ingredients = db.findAll(ingredientSchema);
        setIngredientList(ingredients || []);
    }, []);

    return (
        <GlobalStateContext.Provider
            value={{
                recipeList,
                setRecipeList,
                ingredientList,
                setIngredientList,
                isShoppingListUpdated,
                setisShoppingListUpdated,
                isMealPlanUpdated,
                setIsMealPlanUpdated,
            }}
        >
            {children}
        </GlobalStateContext.Provider>
    );
};
