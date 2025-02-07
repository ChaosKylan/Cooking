import Schema from "../../lib/data/schema/schema";

export const mealPlansSchema: Schema = {
    tableName: "MealPlans",
    columns: {
        ID: {
            type: "number",
            PK: true,
            NotNull: true,
        },
        planName: {
            type: "string",
        },
    },
};
