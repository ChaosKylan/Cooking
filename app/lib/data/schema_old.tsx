import SQliter from "./sql";
interface Model {
    [key: string]: any;
}

class DynamicModel {
    [key: string]: any;
    private schemaName: string;
    private connection: SQliter;
    private model: any;
    constructor(_data: Model, _schemaName: string) {
        Object.assign(this, _data);
        this.schemaName = _schemaName;
        this.connection = SQliter.connection();
        this.model = _data;
    }

    private getKeyValuePairs() {
        var keyValuePairs = [];

        for (var i = 0; i < this.model.length; i++) {
            var keyValue: { key: any; value: any } = {
                key: this.model[i],
                value: this[this.model[i]],
            };
            keyValuePairs.push(keyValue);
        }
        return keyValuePairs;
    }

    insert() {
        var keyValuePairs = this.getKeyValuePairs();

        var queryPartOne = `INSERT INTO ${this.schemaName} (`;
        var queryPartTwo = `) VALUES ( `;
        var queryPartThree = `)`;

        for (var i = 0; i < keyValuePairs.length; i++) {
            queryPartOne += `${keyValuePairs[i].key}`;
            queryPartTwo += `"${keyValuePairs[i].value}"`;
            if (i + 1 != keyValuePairs.length) {
                queryPartOne += `, `;
                queryPartTwo += `, `;
            }
        }

        var query = queryPartOne + queryPartTwo + queryPartThree;

        console.log("INSERT: " + query);

        return this.connection.executeSqlWihtout(query);
    }

    update() {
        var keyValuePairs = this.getKeyValuePairs();

        var queryPartOne = `UPDATE ${this.schemaName} SET `;
        var queryPartTwo = `WHERE `;
        for (var i = 0; i < keyValuePairs.length; i++) {
            if (keyValuePairs[i].key == "ID") {
                queryPartTwo += `ID ==  ${keyValuePairs[i].value}`;
                continue;
            } else {
                queryPartOne += `${keyValuePairs[i].key} = "${keyValuePairs[i].value}"`;
            }

            if (i != keyValuePairs.length + 1) {
                queryPartOne += `, `;
            }
        }
        var query = queryPartOne;

        return this.connection.executeSqlWihtout(query);
    }

    delete() {
        var keyValuePairs = this.getKeyValuePairs();
        var query = `DELETE FROM ${this.schemaName} WHERE `;
        for (var i = 0; i < keyValuePairs.length; i++) {
            if (keyValuePairs[i].key == "ID") {
                query += `ID ==  ${keyValuePairs[i].value}`;
                break;
            }
        }

        return this.connection.executeSqlWihtout(query);
    }
}

class Schema {
    schema;
    connection: SQliter;
    constructor(_schema: any) {
        this.schema = _schema;
        this.connection = SQliter.connection();
        // var result = this.connection.createTable(this.schema);
    }
    getModel() {
        var cleanedSchema = [];
        const objKey = Object.keys(this.schema)[0];
        for (var keys in this.schema[objKey]) {
            cleanedSchema.push(keys);
        }
        var test = new DynamicModel(cleanedSchema, Object.keys(this.schema)[0]);
        return test;
    }
    testGetAll() {
        this.connection.executeSqlWithReturn(
            "Select * from " + Object.keys(this.schema)[0]
        );
    }
}

export default Schema;
