interface UpgradeTableSchema {
    [dbVersion: number]: {
        [tableName: string]: {
            columns: {
                [key: string]: {
                    type: "string" | "number" | "boolean";
                    NotNull?: boolean;
                    upgradeType: "add" | "modify" | "delete";
                };
            };
        };
    };
}
