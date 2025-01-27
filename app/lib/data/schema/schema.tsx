import ColumnSchema from "./columnSchema";

interface Schema {
    tableName: string;
    columns: {
        [key: string]: ColumnSchema;
    };
}

export default Schema;
