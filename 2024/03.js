const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test03.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input03.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
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
    let results = info.matchAll(/mul\((\d{1,3})\,(\d{1,3})\)/g)

    for (r of results) {
        sum += Number(r[1]) * Number(r[2])
    }
    return sum
}

function partB(info) {
    let sum = 0
    let results = info.matchAll(/(do\(\)|don\'t\(\)|mul\(\d{1,3}\,\d{1,3}\))/g)

    let on = true
    for (r of results) {
        if (r[1] == "do()") {
            on = true
        }
        else if (r[1] == "don't()") {
            on = false
        }
        else {
            if (on) {
                sum += Number(r[1].between('mul(', ',')) * Number(r[1].between(',', ')'))
            }
        }
    }
    return sum
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
console.log(partB(test))
console.log(partB(input))
