import * as mysql from 'mysql';
import { promises } from 'fs';
const config = {
    host: 'localhost',
    user: 'retterstol',
    password: '',
    database: 'chatbot'
}

getNexWord("jeg");

async function getNexWord(word:string):Promise<string|null> {
    const connection = mysql.createConnection(config);
    connection.connect();        
    try {
        const words:any[] = await getAllWords(word, connection);
        const sortedList = sortList(words);
        const fiveMostLikely = sortedList.slice(0, 5);
        console.log(fiveMostLikely);
        return words[0];
    } catch (error) {
        console.log(error);
        return null;
    }finally{
        connection.end();
    }
}


function getAllWords(word:string, connection:mysql.Connection):Promise<any[]>{
    return new Promise((resolve,reject) => {
        connection.query("select word, word_count from words where id in (select second_word_id from next_words where first_word_id = (select id from words where word = ?))",
        word, (error, result) => {
            if(error) reject(error);
            else resolve(result);
        })
    })
}

function sortList(list:any[]):any[]{
    return list.sort((left, right) => {
        if(left.word_count > right.word_count) return -1;
        else if (left.word_count < right.word_count) return 1;
        else return 0;
    });
}