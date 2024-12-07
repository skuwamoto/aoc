const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test07.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input07.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => { return {answer: Number(x.before(':')), terms: x.after(': ').split(' ').map(Number) }})
    return lines
}

test = parse(test)
input = parse(input)

function check(answer, first, rest, allowConcat) {
    if (rest.length == 0) return answer == first

    let next = rest.slice(1)
    if (check(answer, first + rest[0], next, allowConcat)) return true
    if (check(answer, first * rest[0], next, allowConcat)) return true
    if (allowConcat && check(answer, Number('' + first + rest[0]), next, allowConcat)) return true

    return false
}

function partA(info) {
    let sum = 0

    for (let {answer, terms} of info) {
        if (check(answer, terms[0], terms.slice(1), false)) {
            sum += answer
        }
    }
    return sum
}

function partB(info) {
    let sum = 0

    for (let {answer, terms} of info) {
        if (check(answer, terms[0], terms.slice(1), true)) {
            sum += answer
        }
    }
    return sum
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
