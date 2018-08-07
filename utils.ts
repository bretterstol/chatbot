import * as mysql from 'mysql';

let connection:mysql.Connection;

const config = {
    host: 'localhost',
    user: 'retterstol',
    password: '',
    database: 'chatbot'
}
interface Config{
    host: string,
    user: string,
    password: string,
    database: string

}



function getConnection(){

    const createConnection = (config:Config) => {
        return mysql.createConnection(config);
    }

    if(connection === undefined){
        connection = createConnection(config);
        connection.connect();
    }
    
    return connection;
}

export default {
    getConnection
}
