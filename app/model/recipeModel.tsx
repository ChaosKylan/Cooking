import Schema from "../lib/data/schema";
const recipeSchema = new Schema({
    recipe: {
        ID: {
            type: "INT",
            PK: true,
            NotNull: true,
        },
        recipeIngredient: {
            type: "TEXT",
        },
        recipeInstructions: {
            type: "TEXT",
        },
    },
});

export default recipeSchema;
