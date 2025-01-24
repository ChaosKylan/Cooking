import Schema from "../schema/schema";
const dbVersionSchema: Schema = {
    tableName: "dbVersion",
    columns: {
        Version: {
            type: "number",
            NotNull: true,
            PK: false,
        },
    },
};

export default dbVersionSchema;
