import getFiles from './getFiles';
import insert from './insert';
import readFromFile from './readFromFile';
import moment from 'moment';

const text = "http://www.gutenberg.org/cache/epub/30027/pg30027.txt";

async function main():Promise<void>{
    try {
        const before = moment();
        const name = await getFiles(text, './sult.txt');

        const textFile = readFromFile(name);
        //console.log(textFile);
        const result = await insert(textFile);
        const after = moment();
        console.log(after.diff(before));
    } catch (error) {
        console.error(error)
    }
}


main();