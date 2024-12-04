const fs = require('fs');

function sum(a) { return a.reduce((acc, item) => acc + item, 0) }
function rsort(a) { a.sort((a,b) => b-a); return a }

let test = fs.readFileSync('./test1.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input1.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n\n').map(x => x.split('\n').map(Number)).map(sum)
}

test = parse(test)
input = parse(input)

function partA(x) {
    return rsort(x)[0]
}

function partB(x) {
    x = rsort(x)
    return x[0] + x[1] + x[2]
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))

