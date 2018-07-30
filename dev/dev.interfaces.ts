export interface book{
    title: string,
    author: string,
    release_date: Date
}

export interface IQuery{
    table: string,
    columns: string[] | string,
    values: any[] | any,
}

export interface IQueryDuplecate extends IQuery{
    row_increment?:string
}