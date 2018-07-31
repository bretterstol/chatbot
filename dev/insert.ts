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
        await Promise.all(list.map(insertSentence));
        return true;
    } catch (error) {
        return false;
    }

    async function insertSentence(sentence: string):Promise<void>{
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
    
    async function insertWord(sentence_id: number, words: string[]): Promise<void> {
        const wordInsert = async (word: string): Promise<number> => {
            const wordQuery = new QueryDuplicate({
                table: "words",
                columns: "word",
                values: [word],
                row_increment: "word_count"
            });
            return await wordQuery.insert(connection);
        }
        const word_ids = await Promise.all(words.map(wordInsert));
        let word_combinations: number[][] = [];
        for (let i = 1; i < word_ids.length; i++) {
            word_combinations.push([word_ids[i - 1], word_ids[i]]);
        }
        const combination_ids = await Promise.all(word_combinations.map(async ([first_word_id, second_word_id]): Promise<number> => {
            return await insertWordNext(first_word_id, second_word_id);
        }));
        const word_sentence_ids = await Promise.all(word_ids.map(async (word_id): Promise<number> => {
            return await insertWordSentence(word_id, sentence_id);
        }));
    }
    async function insertWordNext(first_word_id: number, second_word_id: number): Promise<number>{
        let nextWordQuery = new QueryDuplicate({
            table: "next_words",
            columns: ["first_word_id", "second_word_id"],
            values: [first_word_id, second_word_id],
            row_increment: "combination_count"
        });
        return await nextWordQuery.insert(connection);
    }
    async function insertWordSentence(word_id: number, sentence_id: number): Promise<number>{
        let wordSentenceQuery = new Query({
            table: "word_sentence",
            columns: ["word_id", "sentence_id"],
            values: [word_id, sentence_id]
        });
        return await wordSentenceQuery.insert(connection);
    }
}




export default insert;