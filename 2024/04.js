const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test04.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input04.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.stringToGrid()
}

test = parse(test)
input = parse(input)

// console.log(test)
// console.log()

let dirs = [
    [-1,-1],
    [-1,0],
    [-1,1],
    [0,-1],
    [0,0],
    [0,1],
    [1,-1],
    [1,0],
    [1,1]
]

let word = ['X','M','A','S']

function partA(info) {
    let sum = 0

    for (let [i, j] of info.indexes()) {
        for (d of dirs) {
            let ii = i
            let jj = j
            let bad = false
            for (l of word) {
                if (info.getAt(ii,jj) != l) bad = true
                ii += d[0]
                jj += d[1]
            }
            if (!bad) sum++
        }
    }

    return sum
}

let patterns = [
    [['M', '.', 'S'], ['.', 'A', '.'], ['M', '.', 'S']],
    [['S', '.', 'M'], ['.', 'A', '.'], ['S', '.', 'M']],
    [['M', '.', 'M'], ['.', 'A', '.'], ['S', '.', 'S']],
    [['S', '.', 'S'], ['.', 'A', '.'], ['M', '.', 'M']],
]

function partB(info) {
    let sum = 0

    for (let [i, j] of info.indexes()) {
        if (i < info.h()-2 && j < info.w()-2) {
            for (p of patterns) {
                bad = false
                for (let ii = 0; ii < 3; ii++) {
                    for (let jj=0; jj < 3; jj++) {
                        if (p[ii][jj] != '.' && p[ii][jj] != info[i+ii][j+jj]) bad = true
                    }
                }
                if (!bad) { 
                    sum++
                }
            }
        }
    }

    return sum
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
