interface ColumnSchema {
    type: "string" | "number" | "boolean";
    PK?: boolean;
    NotNull?: boolean;
}

interface Schema {
    tableName: string;
    columns: {
        [key: string]: ColumnSchema;
    };
}

export default Schema;

// interface Schema {
//     [key: string]: {
//         type: "string" | "number" | "boolean";
//         PK?: boolean;
//         NotNull?: boolean;
//     };
// }

// export default Schema;
