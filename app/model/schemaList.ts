import Schema from "../lib/data/schema/schema";
import ingredientSchema from "./schema/ingredient";
import { mealPlansSchema } from "./schema/mealPlan";
import { mealRecipRelSchema } from "./schema/mealPlanRecipeRel";
import { recipeSchema } from "./schema/recipe";
import recipIngSchema from "./schema/recipeIngredientRel";
import { shopListIngRelSchema } from "./schema/shoppingList/shopListIngRel";
import { shoppingListSchema } from "./schema/shoppingList/shoppinglist";

const getSchemaList = () => {
    const schemaList: Array<Schema> = [
        recipeSchema,
        recipIngSchema,
        ingredientSchema,
        mealPlansSchema,
        mealRecipRelSchema,
        shopListIngRelSchema,
        shoppingListSchema,
    ];
    return schemaList;
};

export default getSchemaList;
