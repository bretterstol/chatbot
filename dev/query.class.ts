import * as mysql from 'mysql';

export class Query {
    table: string;
    columns: string[] | string;
    values: any[] | any;
    query: string;
    duplicate?: boolean;
    row_increment?: string;

    constructor(table: string, columns: string[] | string, values: any[] | any) {
        this.table = table;
        this.columns = columns;
        this.values = values;
        this.query = this.createQuery();
    }

    insert(connection: mysql.Connection): Promise<number> {
        return new Promise((resolve, reject) => {
            connection.query(this.query, this.getVariables(), (error, result) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }
                else resolve(result.insertId);
            })
        });
    }
    createQuery() {
            return "insert into ??(??) values(?)"
    }
    getVariables(): any[] {
        return [this.table, this.columns, this.values];
    }
}

export class QueryDuplicate extends Query {
    row_increment?: string;

    constructor(table: string, columns: string[] | string, values: any[] | any, row_increment?: string) {
        super(table, columns, values);
        this.row_increment = row_increment;
        this.query = this.createQuery(row_increment);
    }

    createQuery(increment?: string): string {
        if (increment) {
            return "insert into ??(??) values(?) on duplicate key update ?? = 1 + ??";
        } else {
            return "insert into ??(??) values(?) on duplicate key update";
        }
    }
    getVariables(): any[] {
        if(this.row_increment) return [this.table, this.columns, this.values, this.row_increment, this.row_increment];
        else return super.getVariables();
    }

}