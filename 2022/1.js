const fs = require('fs');

let test = fs.readFileSync('./test1.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input1.txt', {encoding:'utf8', flag:'r'});

function parseInput(lines) {
    // chunks of lines, each of which is a number
    return lines.split('\n\n').map(x => x.split('\n').map(Number))
}

test = parseInput(test)
input = parseInput(input)

function partA(lines) {
    let sums = lines.map(arr => arr.reduce((a,b) => a+b))
    let max = 0
    for (let s of sums) {
        max = Math.max(max, s)
    }
    return max
}

function partB(lines) {
    let sums = lines.map(arr => arr.reduce((a,b) => a+b))
    sums.sort((a,b) => b-a)
    return sums[0] + sums[1] + sums[2]
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))

