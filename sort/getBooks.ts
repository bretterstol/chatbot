import request from 'request';


export default async function getBooksByWords(bookURL:string) :Promise<string[]> {
        const bookString = await getBook(bookURL);
        const wordList = createWordListFromString(bookString);
        const filterdList = filterWords(wordList);
        return filterdList;
}


function getBook(url:string):Promise<string>{
    return new Promise((resolve, reject) => {
        request.get(url, (err:any, response:any) => {
            if(err) reject(err);
            else resolve(response.body);
        });
    });
}

function createWordListFromString(string:string){
    return String(string).split(/ |\n|\r|\t/).filter(noneEmptyWord);
}

function filterWords(list:string[]){
    return list.map(word => {
        const filtered = word.match(/[æøåÆØÅa-zA-Z]*/);
        return (filtered && filtered[0].toLowerCase()) || "";   
    }).filter(noneEmptyWord);
}

function noneEmptyWord(word:string){
    return word.length > 0;
}
