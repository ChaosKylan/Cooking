import { useEffect, useState } from "react";
import { Ingredient } from "../../model/templates";

export const useRecipe = (params: any, recipeList: any) => {
    const [recipeName, setRecipeName] = useState<string>("");
    const [ingredients, setIngredients] = useState<Array<Ingredient>>([]);
    const [instructions, setInstructions] = useState<string>("");

    useEffect(() => {
        if (params.recipeID) {
            const recipe = recipeList.find(
                (r: any) => r.ID == Number(params.recipeID)
            );
            if (recipe) {
                setRecipeName(recipe.title);
                const ingredientsArray = recipe.ingredient
                    .split(" | ")
                    .map((ingredient: string, index: number) => {
                        const [value, quantityUnit] = ingredient.split(" , ");
                        const [quantity, unit] = quantityUnit.split(" ");
                        return { id: index, value, quantity, unit };
                    });
                setIngredients(ingredientsArray);
                setInstructions(recipe.instructions);
            }
        }
    }, [params.recipeID, recipeList]);

    return { recipeName, ingredients, instructions };
};
