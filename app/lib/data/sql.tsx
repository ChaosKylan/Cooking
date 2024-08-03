import * as SQLite from "expo-sqlite";
import Schema from "../../lib/data/schema";

class SQliter {
    /*
        Open Database Connection
    */

    static #instance: SQliter;
    db: SQLite.SQLiteDatabase;

    public static connection(_dbName = "cooking.db"): SQliter {
        if (!SQliter.#instance) {
            SQliter.#instance = new SQliter();
        }

        return SQliter.#instance;
    }

    constructor(_dbName = "cooking.db") {
        //   this.db = SQLite.openDatabaseAsync(_dbName);
        this.db = SQLite.openDatabaseSync(_dbName);
    }
    /*
        Create SqLite Table from Schema
    */
    createTable(_schema: any, name: string) {
        //this.executeSqlWihtout("DROP TABLE " + name);
        let pks = " PRIMARY KEY (";
        const objKey = Object.keys(_schema)[0];
        let query = `CREATE TABLE IF NOT EXISTS ${name} (`;
        Object.keys(_schema).forEach((key) => {
            const schemaDetails = _schema[key];

            query += `"${key}" ${this.getDataType(schemaDetails.type)} `;

            if (schemaDetails.NotNull == true) {
                query += `NOT NULL `;
            }
            if (schemaDetails.PK == true) {
                pks += key + ",";
            }

            query += ` ,`;
        });
        pks = pks.substring(0, pks.length - 1);
        query += pks + "))";

        this.executeSqlWihtout(query);
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
    // Funktion zum Ausführen von SQL-Abfragen, die keine Ergebnisse zurückgeben
    async executeSqlWihtout(sql: string, params = []) {
        try {
            const result = await this.db.runSync(sql);
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    // Funktion zum Ausführen von SQL-Abfragen, die Ergebnisse zurückgeben
    async executeSqlWithReturn(sql: string) {
        console.log(sql);
        // const rows = await this.db.getAllSync(sql);
        const rows = await this.db.getAllAsync(sql);
        console.log("SELECT: " + rows);
        return rows; // (row = id, value, initValue)
    }

    findOne(name: string, schema: Schema) {
        try {
            const row: any = this.db.getAllSync(`SELECT * FROM ${name}`);

            var model = this.generateModelFromSchema(name, schema, row[0]);
            return model;
        } catch (e) {
            console.log(e);
        }
    }
    // Funktion zum Schließen der Datenbankverbindung
    closeDatabase() {
        if (this.db) {
            this.db.closeAsync();
        }
    }

    public static Model(
        name: string,
        schema: Schema,
        data: { [key: string]: any } = {}
    ) {
        var sqlite = new SQliter();
        return sqlite.generateModelFromSchema(name, schema, data);
    }

    generateModelFromSchema(
        _name: string,
        _schema: Schema,
        data: { [key: string]: any } = {}
    ) {
        class DynamicModel {
            [key: string]: any;
            private schema: Schema;
            private name: string;
            private sqliter: SQliter;

            constructor(data: { [key: string]: any }) {
                this.schema = _schema;
                this.name = _name;
                this.sqliter = new SQliter();
                Object.keys(this.schema).forEach((key) => {
                    const schemaDetails = this.schema[key];
                    if (data[key] !== undefined) {
                        this[key] = data[key];
                    } else {
                        this[key] = this.getDefault(schemaDetails.type);
                    }
                });
                this.sqliter = new SQliter();
                this.sqliter.createTable(this.schema, this.name);
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

                Object.keys(this.schema).forEach((key) => {
                    const schemaDetails = this.schema[key];
                    queryPartOne += `${key} ,`;
                    queryPartTwo += `"${this[key]}" ,`;
                });

                queryPartOne = queryPartOne.slice(0, -1);
                queryPartTwo = queryPartTwo.slice(0, -1);
                this.sqliter.executeSqlWihtout(
                    queryPartOne + queryPartTwo + queryPartThree
                );
            }
            update() {
                var queryPartOne = `UPDATE ${this.name} SET `;
                var queryPartTwo = `WHERE `;
                Object.keys(this.schema).forEach((key) => {
                    if (key == "ID") {
                        queryPartTwo += `ID == ${this[key]}`;
                    }
                    queryPartOne += `"${key}" = "${this[key]}" ,`;
                });
                queryPartOne = queryPartOne.slice(0, -1);
                this.sqliter.executeSqlWihtout(queryPartOne + queryPartTwo);
            }
            delete() {
                var query = `DELETE FROM ${this.name} WHERE `;
                Object.keys(this.schema).forEach((key) => {
                    if (key == "ID") {
                        query += `ID == ${this[key]}`;
                    }
                });
                this.sqliter.executeSqlWihtout(query);
            }
        }
        return new DynamicModel(data);
    }
}

export default SQliter;
