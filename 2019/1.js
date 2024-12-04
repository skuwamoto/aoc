const fs = require('fs');
const util = require('util')

let input = fs.readFileSync('./input1.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n').map(Number)
}

input = parse(input)

function partA(lines) {
    let sum = 0
    for (l of lines) {
        amt = Math.floor(l/3) - 2
            sum += amt

    }
    return sum
}

function partB(lines) {
    let sum = 0
    for (l of lines) {
        while( (amt = Math.floor(l/3) - 2) > 0) {
            sum += amt
            l = amt
        }

    }
    return sum
}

console.log(partA(input))
console.log('--')
console.log(partB(input))

