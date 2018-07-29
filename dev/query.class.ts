import { stringifiedQuery } from './dev.interfaces';
import * as mysql from 'mysql';

export class Query {
    table: string;
    columns: string[] | string;
    values: any[] | any;
    query: string;

    constructor(table: string, columns: string[] | string, values: any[] | any) {
        this.table = table;
        this.columns = columns;
        this.values = values;
        this.query = "insert into ??(??) values(?)";
    }

    public insert(connection: mysql.Connection): Promise<number> {
        return new Promise((resolve, reject) => {
            connection.query(this.query, [this.table, this.columns, this.values], (error, result) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }
                else resolve(result.insertId);
            })
        });
    }
}

export class QueryDuplicate extends Query {
    row_increment?: string;

    constructor(table: string, columns: string[] | string, values: any[] | any, row_increment?: string) {
        super(table, columns, values);
        this.row_increment = row_increment;
        this.query = this.createQuery(row_increment);
    }

    private createQuery(increment?: string): string {
        if (increment) {
            return "insert into words(word) values(?) on duplicate key update ${increment} = 1 + ${increment}";
        } else {
            return "insert into words(word) values(?) on duplicate key update";
        }
    }
}