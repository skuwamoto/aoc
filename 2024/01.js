const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test01.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input01.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => x.split(/\s+/).map(Number))
    return lines.transpose()
}

test = parse(test)
input = parse(input)

function partA(info) {
    let [a,b] = info
    a.nsort()
    b.nsort()

    let sum = 0
    for (i=0; i<a.length; i++) {
        sum += Math.abs(a[i]-b[i])
    }
    return sum
}

function partB(info) {
    let [a,b] = info

    let bMap = {}

    for (i=0; i<a.length; i++) {
        bMap[b[i]] = bMap[b[i]] ? bMap[b[i]] + 1 : 1
    }

    let tot = 0
    for (i=0; i<a.length; i++) {
        tot += a[i] * (bMap[a[i]] ? bMap[a[i]] : 0)
    }

    return tot
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
console.log(partB(test))
console.log(partB(input))
