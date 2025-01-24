import Schema from "../schema/schema";
import SQliter from "../sql";

class UpgradeTableSchemaHandler {
    private sqliter: SQliter;

    constructor() {
        this.sqliter = SQliter.connection();
    }

    async upgradeDatabase(
        upgradeSchema: UpgradeTableSchema,
        currentVersion: number
    ) {
        for (
            let version = currentVersion + 1;
            version <= Math.max(...Object.keys(upgradeSchema).map(Number));
            version++
        ) {
            if (upgradeSchema[version]) {
                for (const tableName in upgradeSchema[version]) {
                    const tableUpgrade = upgradeSchema[version][tableName];
                    const currentSchema: Schema =
                        this.sqliter.getTableSchema(tableName);
                    const newColumns: { [key: string]: any } = {};

                    for (const columnName in tableUpgrade.columns) {
                        const columnUpgrade = tableUpgrade.columns[columnName];
                        if (columnUpgrade.upgradeType === "add") {
                            newColumns[columnName] = {
                                type: columnUpgrade.type,
                                NotNull: columnUpgrade.NotNull,
                            };
                        } else if (columnUpgrade.upgradeType === "modify") {
                            currentSchema.columns[columnName] = {
                                type: columnUpgrade.type,
                                NotNull: columnUpgrade.NotNull,
                            };
                        } else if (columnUpgrade.upgradeType === "delete") {
                            delete currentSchema.columns[columnName];
                        }
                    }

                    await this.sqliter.upgradeTable(currentSchema, newColumns);
                }
            }
        }
    }
}

export default UpgradeTableSchemaHandler;
