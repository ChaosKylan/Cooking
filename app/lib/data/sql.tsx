import * as SQLite from "expo-sqlite";
import Schema from "../../lib/data/schema";

class SQliter {
    /*
        Open Database Connection
    */
    db: any;

    async connection(_dbName = "cooking.db") {
        this.db = await SQLite.openDatabaseAsync(_dbName);
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
        //  console.log(query);

        this.executeSqlWihtout(query);
        // this.executeSql("Insert INTO books(ISBN, title) values(123,'test')");
        // this.querySql("Select * From books");
    }
    // Funktion zum Ausführen von SQL-Abfragen, die keine Ergebnisse zurückgeben
    async executeSqlWihtout(sql: String) {
        const result = await this.db.runAsync(sql);
        return result;
    }

    // Funktion zum Ausführen von SQL-Abfragen, die Ergebnisse zurückgeben
    async executeSqlWithReturn(sql: String) {
        const rows = await this.db.getAllAsync(sql);
        return rows; // (row = id, value, initValue)
    }

    // Funktion zum Schließen der Datenbankverbindung
    closeDatabase() {
        if (this.db) {
            this.db._db.close();
        }
    }
}

export default SQliter;
