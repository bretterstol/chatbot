import * as mysql from 'mysql';
import {Query} from './dev.interfaces';

const config = {
    host:'localhost',
    user:'retterstol',
    password: '',
    database: 'chatbot'
}


async function insert(text:string):Promise<boolean> {
    const connection = mysql.createConnection(config);
    connection.connect();
    try {
        const sentences = makeWordList(text);
        const result = await insertWords(sentences, connection);
        return result;
    } catch (error) {
        return false;
    } finally{
        connection.end();
    }
}

function makeWordList(text:string):string[]{
    //console.log(book);
    const cleanString = text.replace(/\n|\r|\t/g, " ");
    
    return cleanString.split(/\./g)
}
async function insertWords(list:string[], connection:mysql.Connection):Promise<boolean>{
    try{
        for (let sentence of list){
            let fixedSentence = sentence.replace(/[\u0800-\uFFFF]/g, '');
            const sentence_id = await new Promise((resolve, reject) => {
                connection.query("insert into sentences(sentence) values(?)", [fixedSentence], (error, result) => {
                    if(error) reject(error);
                    else resolve(result.insertId);
                })});
            let words = fixedSentence.split(" ");
            for(let word of words){                
                let word_id = await new Promise((resolve, reject) => {
                    connection.query("insert into words(word) values(?) on duplicate key update word_count = 1 + word_count", [word], (error, result) => {
                    if(error) reject(error);
                    else{
                     resolve(result.insertId);
                    }
                })});
                const word_sentence_id = await new Promise((resolve, reject) => {
                    connection.query("insert into word_sentence(word_id, sentence_id) values(?, ?)", [word_id, sentence_id], (error, result) => {
                    if(error){
                         reject(error);
                    }
                    else {
                        resolve(result.insertId);
                    }
                })});
            }
        }
        return true;
    }catch(error){
        return false;
    }
}


function insertInto(query:Query, connection:mysql.Connection):Promise<number>{
    return new Promise((resolve, reject) => {
        connection.query("insert into ??(?) values(?)", [query.table, query.columns ,query.values], (error, result) => {
            if(error)reject(error);
           else resolve(result.insertId);
       })});
}

export default insert;