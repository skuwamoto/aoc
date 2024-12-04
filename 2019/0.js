const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./testN.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./inputN.txt', {encoding:'utf8', flag:'r'});

test = parse(test)
input = parse(input)

console.log(test)
console.log()

// test.print()

function parse(lines) {
    return lines.split(',').map(Number)
}

function partA(info) {
}

function partB(info) {
}

console.log(parse(test))

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))

