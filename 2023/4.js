const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test4.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input4.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => x.after(':').split('|').map(y => y.split(' ').map(Number).filter(y => y != 0)))
    return lines
}

test = parse(test)
input = parse(input)

function partA(lines) {
    let sum = 0

    for (l of lines) {
        let num = u.intersect(l[0], l[1]).length
        if (num) {
            sum += Math.pow(2, num-1)
        }
    }

    return sum
}

function partB(lines) {
    let numCards = u.newArr(lines.length, 1)

    for (let i=0; i < lines.length; i++) {
        let l = lines[i]
        let num = u.intersect(l[0], l[1]).length

        for (j=0; j<num; j++) {
            numCards[i+j+1] += numCards[i]
        }
    }

    return numCards.sum()
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
