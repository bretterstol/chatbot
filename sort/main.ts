import books from './getBooks';
import * as fs from 'fs';
import * as path from 'path';
import {WordCount, Counter, Urls} from './bookList.interface'

async function main(word:string) {
    try {
        const file = fs.readFileSync(path.resolve('./bookURLS.json'), "utf-8");
        const bookUrls:Urls =  JSON.parse(file);
        const bookLists = await Promise.all(bookUrls.urls.map(url => books(url)));
        const wordMap = createHashMaps(bookLists);
        const sortedWords = sortWords(wordMap);
    } catch (error) {
        console.log(error)
        return null;
    }
}
function createHashMaps(bookLists:string[][]) {
    const bookMap = {};
    return bookLists.reduce((hashmap, bookList) => {
        const reversedList = bookList.reverse();
        reversedList.forEach((nextWord, index) => {
            if (reversedList[index + 1]) {
                const word = reversedList[index + 1];
                setInnerHash(hashmap, word, nextWord);
            }
        });
        return hashmap; 
    }, bookMap); 
}

function setInnerHash(hashMap:Counter|any = {}, word:string, nextWord:string):WordCount|{} {
     if (hashMap[word]) {
        hashMap[word] = incInInnerHash(hashMap[word], nextWord);
    } else { 
        hashMap[word] = {[nextWord]: 1}
    }
    return hashMap
}

function incInInnerHash(hashMap:{}|any, key:string) {
    if(hashMap[key]) return {...hashMap, [key]: hashMap[key] + 1};
    else return {...hashMap, [key]: 1};
}


function sortWords(map:{}|any = {}) {
    const list = Object.keys(map)
    list.forEach(inner => {
        const innerMap = map[inner];
        const keys = Object.keys(innerMap);
        map = {...map ,[inner]: [...keys.sort(sortFunc)]};

        function sortFunc(left:string, right:string) {
            const leftValue = innerMap[left];
            const rightValue = innerMap[right];
            if (leftValue > rightValue) return -1;
            else if (leftValue < rightValue) return 1;
            else return 0;
        }
    });
    return map;
}
main("jeg");