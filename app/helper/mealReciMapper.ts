import SQliter from "../lib/data/sql";
import { mealPlansSchema } from "../model/schema/mealPlan";
import { mealRecipRelSchema } from "../model/schema/mealPlanRecipeRel";
import { recipeSchema } from "../model/schema/recipe";
import { RecipeWithOrder } from "../model/templates";

const mealReciMapper = (planID: number): RecipeWithOrder[] => {
    var mealPlanModel = SQliter.connection().findOne(
        mealPlansSchema,
        `ID = ${planID}`
    );
    var data = mealPlanModel?.join(recipeSchema, mealRecipRelSchema);

    var recipeList: RecipeWithOrder[] = [];

    if (data && Array.isArray(data.target) && Array.isArray(data.relation)) {
        for (let i = 0; i < data.target.length; i++) {
            const item = data.target[i];
            const relation = data.relation[i];
            const newEntry: RecipeWithOrder = {
                recipe: {
                    ID: item.ID,
                    title: item.title,
                    ingredient: item.ingredient,
                    instructions: item.instructions,
                },
                orderID: relation ? relation.orderID : null,
                done: relation ? relation.done === "true" : false,
            };
            recipeList.push(newEntry);
        }
    }
    return recipeList;
};

export default mealReciMapper;
