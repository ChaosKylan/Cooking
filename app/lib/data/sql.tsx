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
    createTable(_schema: any) {
        let pks = " PRIMARY KEY (";
        const objKey = Object.keys(_schema)[0];
        let query = `CREATE TABLE IF NOT EXISTS ${objKey} (`;
        for (var key in _schema[objKey]) {
            //console.log(key);
            const sub = _schema[objKey][key];
            query += key + " " + sub.type + " ";

            if (sub.PK && sub.PK == true) {
                pks += key + ",";
            }
            if (sub.NotNull && sub.NotNull == true) {
                query += "NOT NULL ";
            }
            query += ",";
        }
        pks = pks.substring(0, pks.length - 1);
        query += pks + "))";

        this.executeSqlWihtout(query);
    }
    // Funktion zum Ausführen von SQL-Abfragen, die keine Ergebnisse zurückgeben
    async executeSqlWihtout(sql: string, params = []) {
        const result = this.db.runAsync(sql);
        console.log(result);
        return result;
    }

    // Funktion zum Ausführen von SQL-Abfragen, die Ergebnisse zurückgeben
    async executeSqlWithReturn(sql: string) {
        console.log(sql);
        // const rows = await this.db.getAllSync(sql);
        const rows = await this.db.getAllAsync(sql);
        // console.log("SELECT: " + rows[0].value);
        return rows; // (row = id, value, initValue)
    }

    // Funktion zum Schließen der Datenbankverbindung
    closeDatabase() {
        if (this.db) {
            this.db.closeAsync();
        }
    }
}

export default SQliter;
