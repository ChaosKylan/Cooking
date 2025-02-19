// import SQliter from "../lib/data/sql";
// import { mealPlansSchema } from "../model/schema/mealPlan";
// import { mealRecipRelSchema } from "../model/schema/mealPlanRecipeRel";
// import { recipeSchema } from "../model/schema/recipe";
// import { Recipe } from "../model/templates";
// import { RecipeWithOrder } from "../model/templates";

// const mealReciMapper = (planID: number): Recipe[] => {
//     var mealPlanModel = SQliter.connection().findOne(
//         mealPlansSchema,
//         `ID = ${planID}`
//     );
//     var data = mealPlanModel?.join(recipeSchema, mealRecipRelSchema);

//     console.log(data);

//     var recipeList: Recipe[] = [];
//     if (data && Array.isArray(data.target)) {
//         recipeList = data.target.map((item: any) => ({
//             ID: item.ID,
//             title: item.title,
//             ingredient: item.ingredient,
//             instructions: item.instructions,
//         }));
//     }
//     return recipeList;
// };

// export default mealReciMapper;
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
    // if (data && Array.isArray(data.target) && Array.isArray(data.relation)) {
    //     recipeList = data.target.map((item: any) => {
    //         const relation =
    //             data && data.relation
    //                 ? data.relation.find(
    //                       (rel: any) => rel.recipesID === item.ID
    //                   )
    //                 : null;
    //         return {
    //             recipe: {
    //                 ID: item.ID,
    //                 title: item.title,
    //                 ingredient: item.ingredient,
    //                 instructions: item.instructions,
    //             },
    //             orderID: relation ? relation.orderID : null,
    //             done: relation ? relation.done === "true" : false,
    //         };
    //     });
    // }
    return recipeList;
};

export default mealReciMapper;
