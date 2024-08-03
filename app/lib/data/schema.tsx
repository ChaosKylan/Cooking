interface Schema {
    [key: string]: {
        type: "string" | "number" | "boolean";
        PK?: boolean;
        NotNull?: boolean;
    };
}

export default Schema;
