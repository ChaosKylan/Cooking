import Schema from "../../lib/data/schema/schema";

export const recipeSchema: Schema = {
    tableName: "Recipes",
    columns: {
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
    },
};
33;
