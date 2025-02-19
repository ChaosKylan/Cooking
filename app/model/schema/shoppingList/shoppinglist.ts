import Schema from "../../../lib/data/schema/schema";

export const shoppingListSchema: Schema = {
    tableName: "ShoppingLists",
    columns: {
        ID: {
            type: "number",
            PK: true,
            NotNull: true,
        },
        listName: {
            type: "string",
        },
    },
};
