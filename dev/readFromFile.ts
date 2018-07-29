import * as fs from 'fs';

export default function readFromFile(name:string):string{
    const text = fs.readFileSync(name, 'UTF-8');
    return text;
}
