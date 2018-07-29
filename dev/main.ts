import getFiles from './getFiles';
import insert from './insert';
import readFromFile from './readFromFile';

const text = "http://www.gutenberg.org/cache/epub/30027/pg30027.txt";

async function main():Promise<void>{
    try {
        const name = await getFiles(text, './sult.txt');
        const textFile = readFromFile(name);
        //console.log(textFile);
        const result = await insert(textFile);
    } catch (error) {
        console.error(error)
    }
}


main();