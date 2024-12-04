const fs = require('fs');
let d = fs.readFileSync('./input10.txt', 'utf8');

x = [1];
d.split('\n').map(z => +z.slice(5)).map(i=>{x.push(x.at(-1));i?x.push(x.at(-1)+i):0})
console.log(x.reduce((a,b,c)=>a+" \n"[+!(c%40)]+'■.'[(c%40-b)**2>1|0], ''))
