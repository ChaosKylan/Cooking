// import SQliter from "../lib/data/sql";
// import ingredientSchema from "../model/schema/ingredient";
// import { Ingredient } from "../model/templates";

// const getIngredientID = (ingredient: Ingredient) => {
//     console.log(ingredient);
//     var newIng = SQliter.Model(ingredientSchema);
//     if (ingredient.ID === -1) {
//         newIng.ingName = ingredient.ingName;
//         newIng = newIng.insert();
//         return newIng.id;
//     } else {
//         newIng.id = ingredient.ID;
//         return newIng.id;
//     }
// };

// export default getIngredientID;
import SQliter from "@/app/lib/data/sql";
import ingredientSchema from "@/app/model/schema/ingredient";
import { Ingredient } from "../model/templates";

export default function getIngredientID(ingredient: Ingredient) {
    // Überprüfen, ob die Zutat bereits existiert
    var existingIngredient = SQliter.connection().findOne(
        ingredientSchema,
        `ingName = '${ingredient.ingName}'`
    );

    if (existingIngredient) {
        if (existingIngredient.ingName !== "") {
            return existingIngredient.ID;
        } else {
            // Wenn die Zutat nicht existiert, füge sie hinzu und gib die neue ID zurück
            var newIngredient = SQliter.Model(ingredientSchema);
            newIngredient.ingName = ingredient.ingName;
            newIngredient = newIngredient.insert();

            return newIngredient.ID;
        }
    }
}
