import Schema from "../lib/data/schema";

export const recipeSchema: Schema = {
    ID: {
        type: "number",
        PK: true,
        NotNull: true,
    },
    recipeIngredient: {
        type: "string",
    },
    recipeInstructions: {
        type: "string",
    },
};
