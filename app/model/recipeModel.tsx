import Schema from "../lib/data/schema";

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

export const ingredientSchema: Schema = {
    tableName: "Ingredients",
    columns: {
        ID: {
            type: "number",
            PK: true,
            NotNull: true,
        },
        name: {
            type: "string",
        },
    },
};

export const recipIngSchema: Schema = {
    tableName: "RecipIngRel",
    columns: {
        recipeID: {
            type: "number",
            PK: true,
            NotNull: true,
        },
        ingredientID: {
            type: "number",
            PK: true,
            NotNull: true,
        },
        quantity: {
            type: "string",
        },
    },
};
