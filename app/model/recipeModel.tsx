import Schema from "../lib/data/schema";

export const recipeSchema: Schema = {
    ID: {
        type: "number",
        PK: true,
        NotNull: true,
    },
    title: {
        type: "string",
    },
    ingredient: {
        type: "string",
    },
    instructions: {
        type: "string",
    },
};
