import Schema from "../../lib/data/schema/schema";

export const mealRecipRelSchema: Schema = {
    tableName: "MealRecipRelSchema",
    columns: {
        mealplansID: {
            type: "number",
            NotNull: true,
        },
        recipesID: {
            type: "number",
            NotNull: true,
        },
        done: {
            type: "boolean",
            NotNull: true,
        },
        orderID: {
            type: "number",
            NotNull: true,
        },
    },
};
