export interface book{
    title: string,
    author: string,
    release_date: Date
}

export interface IQuery{
    table: string,
    columns: string[],
    values: any[],
}

export interface stringifiedQuery{
    table: string,
    columns: string|string[],
    values: string,
    duplicate?: string,
    duplicate_inc?: string 
}
