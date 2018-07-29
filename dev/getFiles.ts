import * as request from 'request';
import * as fs from 'fs';


async function getFiles(url:string, name: string):Promise<string> {
    try {
        const textFile = await callApi(url);
        const writeToFile = fs.writeFileSync('./'+name, textFile, {encoding: 'UTF-8'});
        return name;
    } catch (error) {
        console.error(error);
        return "";
    }
}

function callApi(url:string):Promise<string> {
    return new Promise((resolve, reject) => {
        request.get(url, (error, res:any) => {
            if(res.statusCode === 200){
                resolve(res.body);
            }else{
                reject(error);
            }
        })
    })
}


export default getFiles;