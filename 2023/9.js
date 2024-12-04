const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test9.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input9.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n').map(x => x.split(' ').map(Number))
}

test = parse(test)
input = parse(input)

console.log(test)
console.log('--')

function partA(lines) {
    sum = 0
    for (l of lines) {
        let seq = [l]
        let last = l
        while ((!last.every(x => x == 0))) {
            let next = []
            for (i=0; i < last.length-1; i++) {
                next.push(last[i+1]-last[i])
            }
            seq.push(next)
            last = next
        }
        let val = 0
        for (i=seq.length-2; i >= 0; i--) {
            val += seq[i][seq[i].length-1]
        }
        sum += val
    }

    return sum
}

function partB(lines) {
    sum = 0
    for (l of lines) {
        let seq = [l]
        let last = l
        while ((!last.every(x => x == 0))) {
            let next = []
            for (i=0; i < last.length-1; i++) {
                next.push(last[i+1]-last[i])
            }
            seq.push(next)
            last = next
        }
        let val = 0
        for (i=seq.length-2; i >= 0; i--) {
            val = seq[i][0] - val
        }
        sum += val
    }

    return sum
}

console.log(partA(test))
console.log(partA(input))
// console.log('--')
console.log(partB(test))
console.log(partB(input))
