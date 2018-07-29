export interface book{
    title: string,
    author: string,
    release_date: Date
}

export interface Query{
    table: string,
    columns: string[],
    values: any[],
    duplicate?: boolean,
    duplicate_inc?: string
}

export interface stringifiedQuery{
    table: string,
    columns: string|string[],
    values: string,
    duplicate?: string,
    duplicate_inc?: string 
}