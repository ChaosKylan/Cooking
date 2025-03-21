import * as SQLite from "expo-sqlite";
import Schema from "./schema/schema";
import ColumnSchema from "./schema/columnSchema";
import UpgradeTableSchemaHandler from "./handler/upgradeTable";
import dbVersionSchema from "./models/dbVersion";

const packageJson = require("../../../package.json");
const projectName = packageJson.name;
const dbName = `${projectName}.db`;

interface exportData {
    schemaName?: string;
    data?: string;
}

class SQliter {
    /*
        Open Database Connection
    */

    static #instance: SQliter;
    db: SQLite.SQLiteDatabase;

    //public static connection(_dbName = "cooking.db"): SQliter {
    public static connection(_dbName = dbName): SQliter {
        if (!SQliter.#instance) {
            SQliter.#instance = new SQliter();
        }

        return SQliter.#instance;
    }

    // constructor(_dbName: string = "cooking.db") {
    constructor(_dbName: string = dbName) {
        this.db = SQLite.openDatabaseSync(_dbName);
        this.createTable(dbVersionSchema);
    }
    /*
        Create SqLite Table from Schema
    */
    createTable(_schema: Schema) {
        let pks: string = " PRIMARY KEY (";
        var name: string = _schema.tableName;
        var hasPk: boolean = false;

        //const objKey = Object.keys(_schema.columns)[0];
        let query = `CREATE TABLE IF NOT EXISTS ${name} (`;
        Object.keys(_schema.columns).forEach((key) => {
            const schemaDetails = _schema.columns[key];
            query += `"${key}" ${this.getDataType(schemaDetails.type)} `;
            if (schemaDetails.NotNull == true) {
                query += `NOT NULL `;
            }
            if (schemaDetails.PK == true) {
                hasPk = true;
                pks += key + ",";
            }

            query += ` ,`;
        });

        if (hasPk) {
            pks = pks.substring(0, pks.length - 1);
            query += pks + "))";
        } else {
            query = query.slice(0, -1);
            query += ")";
        }
        //console.log(query);
        //this.executeSqlWihtout("DROP TABLE IF EXISTS " + name);
        this.executeSqlWihtout(query);
    }
    private findAllData(schema: Schema, where: string = "") {
        try {
            var query = `SELECT * FROM ${schema.tableName} `;
            if (where != "") {
                query += `WHERE ${where}`;
            }
            const row: any = this.db.getAllSync(query);

            return row;
        } catch (e) {
            console.log("findAll", e, schema.tableName);
        }
    }

    clearDatabase(schemaList: Array<Schema>) {
        schemaList.forEach((schema) => {
            this.executeSqlWihtout(`DELETE FROM ${schema.tableName}`);
        });
    }

    exportDataToFile(schemaList: Array<Schema>) {
        var result: exportData[] = [];
        schemaList.forEach((schema) => {
            var rows: exportData = {};
            var dbResult = this.findAllData(schema);
            rows.schemaName = schema.tableName;
            rows.data = JSON.stringify(dbResult);
            result.push(rows);
        });
        return result;
    }

    async upgradeTable(
        oldSchema: Schema,
        newColumns: { [key: string]: ColumnSchema }
    ) {
        const tempTableName = `${oldSchema.tableName}_temp`;

        // Erstellen der neuen Tabelle mit dem neuen Schema
        const updatedSchema: Schema = {
            tableName: tempTableName,
            columns: { ...oldSchema.columns, ...newColumns },
        };
        this.createTable(updatedSchema);

        // Kopieren der Daten aus der alten Tabelle in die neue Tabelle
        const oldColumns = Object.keys(oldSchema.columns).join(", ");
        const newColumnsNames = Object.keys(newColumns).join(", ");
        const copyDataQuery = `INSERT INTO ${tempTableName} (${oldColumns}, ${newColumnsNames}) SELECT ${oldColumns}, ${newColumnsNames} FROM ${oldSchema.tableName}`;
        await this.executeSqlWihtout(copyDataQuery);

        // Löschen der alten Tabelle
        const dropOldTableQuery = `DROP TABLE ${oldSchema.tableName}`;
        await this.executeSqlWihtout(dropOldTableQuery);

        // Umbenennen der neuen Tabelle in den alten Tabellennamen
        const renameTableQuery = `ALTER TABLE ${tempTableName} RENAME TO ${oldSchema.tableName}`;
        await this.executeSqlWihtout(renameTableQuery);
    }

    getDataType(type: "string" | "number" | "boolean"): any {
        switch (type) {
            case "string":
                return "TEXT";
            case "number":
                return "INT";
            case "boolean":
                return "TEXT";
            default:
                return "TEXT";
        }
    }

    async executeSqlWihtout(sql: string, params = []) {
        try {
            // console.log(sql);
            const result = await this.db.runSync(sql);
            return result;
        } catch (e) {
            console.log("executeSqlWihtout", e, sql);
        }
    }

    async executeSqlWithReturn(sql: string) {
        const rows = this.db.getAllSync(sql);
        // console.log("SELECT: " + rows);
        return rows;
    }

    // Methode zum Abrufen des Tabellenschemas
    getTableSchema(tableName: string): Schema {
        try {
            const schemaInfo = this.db.getAllSync(
                `PRAGMA table_info(${tableName})`
            );
            const columns: { [key: string]: ColumnSchema } = {};
            schemaInfo.forEach((column: any) => {
                columns[column.name] = {
                    type: this.getColumnTypeFromSQLiteType(column.type),
                    PK: column.pk === 1,
                    NotNull: column.notnull === 1,
                };
            });
            return {
                tableName,
                columns,
            };
        } catch (e) {
            console.log("getTableSchema", e, tableName);
            throw new Error(`Failed to get schema for table ${tableName}`);
        }
    }

    getColumnTypeFromSQLiteType(type: string): "string" | "number" | "boolean" {
        switch (type.toUpperCase()) {
            case "TEXT":
                return "string";
            case "INTEGER":
                return "number";
            case "BOOLEAN":
                return "boolean";
            default:
                throw new Error("Unsupported column type");
        }
    }

    findOne(schema: Schema, where: string = "") {
        try {
            var row: any = "";
            if (where == "") {
                row = this.db.getAllSync(`SELECT * FROM ${schema.tableName}`);
            } else {
                row = this.db.getAllSync(
                    `SELECT * FROM ${schema.tableName} WHERE ${where}`
                );
            }
            var model = this.generateModelFromSchema(schema, row[0]);
            return model;
        } catch (e) {
            console.log("findOne", e);
        }
    }

    findAll(schema: Schema, where: string = "") {
        try {
            var modelList = [];
            var query = `SELECT * FROM ${schema.tableName} `;
            if (where != "") {
                query += `WHERE ${where}`;
            }
            // var test = this.executeSqlWithReturn(
            //     "Select * from ShopListIngRel"
            // );
            // console.log("test", test);
            // console.log("findAll", query);
            const row: any = this.db.getAllSync(query);

            for (var i = 0; i < row.length; i++) {
                var model = this.generateModelFromSchema(schema, row[i]);
                modelList.push(model);
            }
            // console.log("findAllModel", modelList);
            return modelList;
        } catch (e) {
            console.log("findAll", e, schema.tableName);
        }
    }

    getRelation(name: string, schema: Schema, relation: string) {}

    getMaxID(schema: Schema) {
        try {
            var data = this.db.getAllSync(
                `SELECT MAX(ID) as ID FROM ${schema.tableName}`
            );
            console.log(data);
            return data;
        } catch (e) {
            console.log("getMaxID", e);
        }
    }

    getMax(schema: Schema, row: string, where?: string) {
        try {
            if (where) {
                var data = this.db.getAllSync(
                    `SELECT MAX(${row}) as max FROM ${schema.tableName} where ${where}`
                );
                return (data[0] as { max: number }).max;
            } else {
                var data = this.db.getAllSync(
                    `SELECT MAX(${row}) as max FROM ${schema.tableName}`
                );
                return (data[0] as { max: number }).max;
            }
        } catch (e) {
            console.log("getMax", e);
        }
    }

    getCurrentDbVersion() {
        try {
            var data = this.findOne(dbVersionSchema);
            return data?.Version || 0;
        } catch (e) {
            console.log("getCurrentDbVersion", e);
            return 0;
        }
    }

    // Funktion zum Schließen der Datenbankverbindung
    closeDatabase() {
        if (this.db) {
            this.db.closeAsync();
        }
    }

    public static Model(schema: Schema, data: { [key: string]: any } = {}) {
        var sqlite = SQliter.connection();
        return sqlite.generateModelFromSchema(schema, data);
    }

    public static UpgradeDB(schema: UpgradeTableSchema) {
        try {
            var handler = new UpgradeTableSchemaHandler();
            var sqlite = SQliter.connection();
            var version = sqlite.getCurrentDbVersion();
            handler.upgradeDatabase(schema, version);
        } catch (error) {
            console.error("Error during database upgrade:", error);
        }
    }

    generateModelFromSchema(
        _schema: Schema,
        _data: { [key: string]: any } = {}
    ) {
        class DynamicModel {
            [key: string]: any;
            private schema: Schema;
            private name: string;
            private sqliter: SQliter;
            private relations: any;

            constructor(data: { [key: string]: any }) {
                this.schema = _schema;
                this.name = _schema.tableName;
                this.sqliter = SQliter.connection();
                Object.keys(this.schema.columns).forEach((key) => {
                    const schemaDetails = this.schema.columns[key];
                    if (data[key] !== undefined) {
                        this[key] = data[key];
                    } else {
                        this[key] = this.getDefault(schemaDetails.type);
                    }
                });
                // this.sqliter = SQliter.connection();
                // this.sqliter.createTable(this.schema, this.name);
            }
            getDefault(type: "string" | "number" | "boolean"): any {
                switch (type) {
                    case "string":
                        return "";
                    case "number":
                        return 0;
                    case "boolean":
                        return false;
                    default:
                        return null;
                }
            }
            insert() {
                var queryPartOne = `INSERT INTO ${this.name} (`;
                var queryPartTwo = `) VALUES ( `;
                var queryPartThree = `)`;
                var newID = 0;

                Object.keys(this.schema.columns).forEach((key) => {
                    //const schemaDetails = this.schema.columns[key];
                    queryPartOne += `${key} ,`;
                    if (key == "ID" && this[key] == "0") {
                        var models = this.sqliter.findAll(this.schema);
                        var row = models?.reduce(
                            (max, model) => (model.ID > max ? model.ID : max),
                            0
                        );
                        row = row ?? 0;
                        if (row != null || row != "") {
                            queryPartTwo += `'${row + 1}' ,`;
                            newID = row + 1;
                        } else {
                            queryPartTwo += `'${0}' ,`;
                        }
                    } else {
                        queryPartTwo += `'${this[key]}' ,`;
                    }
                });

                queryPartOne = queryPartOne.slice(0, -1);
                queryPartTwo = queryPartTwo.slice(0, -1);
                console.log(
                    "insert",
                    queryPartOne + queryPartTwo + queryPartThree
                );
                this.sqliter.executeSqlWihtout(
                    queryPartOne + queryPartTwo + queryPartThree
                );
                this.ID = newID;
                return this;
            }

            update(where?: string) {
                var queryPartOne = `UPDATE ${this.name} SET `;
                var queryPartTwo = `WHERE `;
                if (where) {
                    Object.keys(this.schema.columns).forEach((key) => {
                        queryPartOne += `"${key}" = "${this[key]}" ,`;
                    });
                    queryPartTwo += ` ${where}`;
                } else {
                    Object.keys(this.schema.columns).forEach((key) => {
                        if (key == "ID") {
                            queryPartTwo += `ID == ${this[key]}`;
                        }
                        queryPartOne += `"${key}" = "${this[key]}" ,`;
                    });
                }
                queryPartOne = queryPartOne.slice(0, -1);
                //console.log(queryPartOne + queryPartTwo);
                this.sqliter.executeSqlWihtout(queryPartOne + queryPartTwo);
            }
            /**
             ** Default via ID
             ** optional custom where
             */
            delete(where: string = "") {
                var query = `DELETE FROM ${this.name} WHERE `;
                4;
                if (where == "") {
                    Object.keys(this.schema.columns).forEach((key) => {
                        if (key == "ID") {
                            query += `ID == ${this[key]}`;
                        }
                    });
                } else {
                    query += where;
                }
                this.sqliter.executeSqlWihtout(query);
            }
            /**
             * Returns all Mapped Data
             ** Actuly only one Target Table is Joinable
             * @param targetScheme Target Table
             * @param relationSchema Mapping Table
             * @returns An Object with to Object Arrays inside. One Object with Target Schema and one wich relationSchema
             */
            join(targetScheme: Schema, relationSchema?: Schema) {
                try {
                    if (relationSchema) {
                        var relationResult = this.sqliter.findAll(
                            relationSchema,
                            `${this.name.toLocaleLowerCase()}ID = ${this["ID"]}`
                        );

                        var relationID = relationResult
                            ? relationResult.map(
                                  (r) =>
                                      r[
                                          `${targetScheme.tableName.toLocaleLowerCase()}ID`
                                      ]
                              )
                            : [];
                        var targetResult: DynamicModel[] = [];
                        relationID.forEach((id) => {
                            const result = this.sqliter.findOne(
                                targetScheme,
                                `ID == ${id}`
                            );
                            if (result) {
                                targetResult.push(result);
                            }
                        });
                        var manyResult = {
                            relation: relationResult,
                            target: targetResult,
                        };
                        return manyResult;
                    } else {
                        var relation = this.sqliter.findAll(
                            targetScheme,
                            `${targetScheme.columns.ID} == ${this.ID}`
                        );
                        var result = {
                            relation: relationResult,
                            target: "",
                        };
                        return result;
                    }
                } catch (error) {
                    console.error("Error during join operation:", error);
                    return null;
                }
            }
        }
        return new DynamicModel(_data);
    }
}

export default SQliter;
