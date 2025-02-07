import SQliter from "../lib/data/sql";
import { mealPlansSchema } from "../model/schema/mealPlan";
import { mealRecipRelSchema } from "../model/schema/mealPlanRecipeRel";
import { recipeSchema } from "../model/schema/recipe";
import { Recipe } from "../model/templates";

const mealReciMapper = (planID: number): Recipe[] => {
    var mealPlanModel = SQliter.connection().findOne(
        mealPlansSchema,
        `ID = ${planID}`
    );
    var data = mealPlanModel?.join(recipeSchema, mealRecipRelSchema);

    var recipeList: Recipe[] = [];
    if (data && Array.isArray(data.target)) {
        recipeList = data.target.map((item: any) => ({
            ID: item.ID,
            title: item.title,
            ingredient: item.ingredient,
            instructions: item.instructions,
        }));
    }
    return recipeList;
};

export default mealReciMapper;
