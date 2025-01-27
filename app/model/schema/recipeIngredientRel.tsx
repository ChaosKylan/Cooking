import Schema from "../../lib/data/schema/schema";

const recipIngSchema: Schema = {
    tableName: "RecipIngRel",
    columns: {
        recipesID: {
            type: "number",
            PK: true,
            NotNull: true,
        },
        ingredientsID: {
            type: "number",
            PK: true,
            NotNull: true,
        },
        quantity: {
            type: "string",
        },
        unit: {
            type: "string",
        },
    },
};

export default recipIngSchema;
