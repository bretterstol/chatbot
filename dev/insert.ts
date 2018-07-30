import * as mysql from 'mysql';
import { Query, QueryDuplicate } from './query.class';

const config = {
    host: 'localhost',
    user: 'retterstol',
    password: '',
    database: 'chatbot'
}


async function insert(text: string): Promise<boolean> {
    const connection = mysql.createConnection(config);
    connection.connect();
    try {
        const sentences = makeWordList(text);
        const result = await insertText(sentences, connection);
        return result;
    } catch (error) {
        return false;
    } finally {
        connection.end();
    }
}

function makeWordList(text: string): string[] {
    const cleanString = text.replace(/\n|\r|\t/g, " ");

    return cleanString.split(/\./g)
}
async function insertText(list: string[], connection: mysql.Connection): Promise<boolean> {
    try {
        const insertWordSentence = async (word_id: number, sentence_id: number):Promise<number> => {
            let wordSentenceQuery = new Query({
                table: "word_sentence", 
                columns: ["word_id", "sentence_id"],
                values: [word_id, sentence_id]
            });
            return await wordSentenceQuery.insert(connection);
        }
        const insertWordNext = async (first_word_id: number, second_word_id: number):Promise<number> => {
            let nextWordQuery = new QueryDuplicate({
                table: "next_words", 
                columns: ["first_word_id", "second_word_id"], 
                values: [first_word_id, second_word_id], 
                row_increment: "combination_count"
            });
            return await nextWordQuery.insert(connection);
        }

        const insertWord = async (sentence_id:number, words:string[]):Promise<void> => {
            let combination: number[] = [];
            for(let word of words){
                let wordQuery = new QueryDuplicate({
                    table: "words", 
                    columns: "word", 
                    values: [word], 
                    row_increment: "word_count"
                });
                const word_id = await wordQuery.insert(connection);
                combination.push(word_id);
                if(combination.length === 2){
                    const [first_word_id, second_word_id] = combination;
                    await insertWordNext(first_word_id, second_word_id);
                    combination = [];
                }
                await insertWordSentence(word_id, sentence_id);
            }
        } 

        const insertSentence = async (sentence: string) => {
            let fixedSentence = sentence.replace(/[\u0800-\uFFFF]/g, '').trim();
            let sentenceQuery = new Query({
                table: "sentences", 
                columns: "sentence", 
                values: [fixedSentence]
            });
            let sentence_id = await sentenceQuery.insert(connection);
            let words = fixedSentence.split(" ");
            return await insertWord(sentence_id, words);
        }
        await Promise.all(list.map(insertSentence));
        return true;
    } catch (error) {
        return false;
    }
}


export default insert;