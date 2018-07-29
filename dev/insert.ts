import * as mysql from 'mysql';
import {Query, QueryDuplicate} from './query.class';

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
        const result = await insertText(sentences, connection);
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
async function insertText(list:string[], connection:mysql.Connection):Promise<boolean>{
    try{
        for (let sentence of list){
            let fixedSentence = sentence.replace(/[\u0800-\uFFFF]/g, '').trim();
            let sentenceQuery = new Query("sentences", "sentence", [fixedSentence]);
            let sentence_id = await sentenceQuery.insert(connection);
            let words = fixedSentence.split(" ");
            for(let word of words){
                let wordQuery = new QueryDuplicate("words", "word", [word], "word_count");                
                let word_id = await wordQuery.insert(connection);
                let wordSentenceQuery = new Query("word_sentence", ["word_id", "sentence_id"], [word_id, sentence_id]);
                let word_sentence_id = await wordSentenceQuery.insert(connection);
            }
        }
        return true;
    }catch(error){
        return false;
    }
}


export default insert;