import SQliter from "./sql";
interface Model {
    [key: string]: any;
}
const connection = new SQliter();

class DynamicModel {
    [key: string]: any;
    private schemaName: string;
    constructor(_data: Model, _schemaName: string) {
        Object.assign(this, _data);
        this.schemaName = _schemaName;
    }

    private getKeyValuePairs() {
        var keyValuePairs = [];

        for (var item in this) {
            var keyValue: { key: any; value: any } = {
                key: Object.keys(item[0]),
                value: item,
            };
            keyValuePairs.push(keyValue);
        }
        return keyValuePairs;
    }

    insert() {
        var keyValuePairs = this.getKeyValuePairs();

        var queryPartOne = `INSERT INTO ${this.schemaName} (`;
        var queryPartTwo = `) values ( `;
        var queryPartThree = `)`;

        for (var i = 0; i < keyValuePairs.length; i++) {
            queryPartOne += keyValuePairs[i].key;
            queryPartTwo += keyValuePairs[i].value;

            if (i != keyValuePairs.length + 1) {
                queryPartOne += `,`;
                queryPartTwo += `,`;
            }
        }
        var query = queryPartOne + queryPartTwo + queryPartThree;

        return connection.executeSqlWihtout(query);
    }
}

class Schema {
    schema;
    constructor(_schema: any) {
        this.schema = _schema;
        connection.createTable(this.schema);
    }
    getModel() {
        return new DynamicModel(this.schema, Object.keys(this.schema)[0]);
    }
}

export default Schema;
