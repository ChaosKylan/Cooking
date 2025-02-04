import Schema from "../../lib/data/schema/schema";

export const mealRecipRelSchema: Schema = {
    tableName: "MealRecipRelSchema",
    columns: {
        mealplansID: {
            type: "number",
            PK: true,
            NotNull: true,
        },
        recipesID: {
            type: "number",
            PK: true,
            NotNull: true,
        },
        done: {
            type: "boolean",
            NotNull: true,
        },
    },
};
