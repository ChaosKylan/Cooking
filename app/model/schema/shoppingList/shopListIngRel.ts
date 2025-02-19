import Schema from "../../../lib/data/schema/schema";

export const shopListIngRelSchema: Schema = {
    tableName: "ShopListIngRel",
    columns: {
        shoppinglistsID: {
            type: "number",
            NotNull: true,
        },
        ingredientsID: {
            type: "number",
            NotNull: true,
        },
        amount: {
            type: "number",
            NotNull: true,
        },
        unit: {
            type: "string",
            NotNull: true,
        },
        done: {
            type: "boolean",
            NotNull: true,
        },
        ID: {
            type: "number",
            NotNull: true,
            PK: true,
        },
    },
};
