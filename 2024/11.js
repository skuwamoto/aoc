const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test11.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input11.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => x.split(''))
    return lines
}

test = parse(test)
input = parse(input)

console.log(test)
console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

function partA(info) {
    let sum = 0
    return sum
}

function partB(info) {
    let sum = 0
    return sum
}

console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
// console.log(partB(input))
