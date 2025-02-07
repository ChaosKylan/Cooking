import { RecipeIngredientRel, IngredientNew } from "../model/templates";
import ingredientSchema from "../model/schema/ingredient";
import recipIngSchema from "../model/schema/recipeIngredientRel";

const recIngMapper = (recipeID: number, recipeList: any[]): string => {
    const recipeModel: any | undefined = recipeList.find(
        (recipe: any) => recipe.ID === recipeID
    );
    const data = recipeModel.join(ingredientSchema, recipIngSchema);

    interface Data {
        relation: RecipeIngredientRel[];
        target: IngredientNew[];
    }

    return data.relation
        .map((relationItem: RecipeIngredientRel) => {
            const targetItem: IngredientNew | undefined = data.target.find(
                (target: IngredientNew) =>
                    target.ID === relationItem.ingredientsID
            );
            if (targetItem) {
                return `${targetItem.ingName} , ${relationItem.quantity} ${relationItem.unit} |`;
            }
            return null;
        })
        .filter((item: string | null): item is string => item !== null)
        .join(" ");
};

export default recIngMapper;
