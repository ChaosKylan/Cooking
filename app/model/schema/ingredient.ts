import Schema from "../../lib/data/schema/schema";

const ingredientSchema: Schema = {
    tableName: "Ingredients",
    columns: {
        ID: {
            type: "number",
            PK: true,
            NotNull: true,
        },
        ingName: {
            type: "string",
        },
    },
};

export default ingredientSchema;
