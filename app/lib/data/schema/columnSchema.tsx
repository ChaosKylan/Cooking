interface ColumnSchema {
    type: "string" | "number" | "boolean";
    PK?: boolean;
    NotNull?: boolean;
}

export default ColumnSchema;
