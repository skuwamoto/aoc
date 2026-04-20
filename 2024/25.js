const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

let test = fs.readFileSync('./test25.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input25.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    let arrangement = lines.split('\n\n').map(x => new Grid(x))
    let keys = []
    let locks = []

    for (let x of arrangement) {
        if (x.getAt(0, 0) == '#') {
            let key = []
            let i, j
            for (j=0; j < x.w(); j++) {
                for (i=1; i < x.h(); i++) {
                    if (x.getAt(i, j) == '.') {
                        break
                    }
                }
                key.push(i-1)
            }
            keys.push(key)
        }

        else {
            let lock = []

            let i, j
            for (j=0; j < x.w(); j++) {
                for (i=x.h()-1; i > 0; i--) {
                    if (x.getAt(i, j) == '.') {
                        break
                    }
                }
                lock.push(x.h() - i - 2)
            }
            locks.push(lock)
        }
    }

    return [keys, locks]
}

test = parse(test)
input = parse(input)

console.log(test)
console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

function canFit(k, l) {
    for (let i=0; i < k.length; i++) {
    if (k[i] + l[i] > 5) return false
    }
    return true
}

function partA(info) {
    let [keys, locks] = info

    let sum = 0
    for (let k of keys) {
        for (let l of locks) {
            if (canFit(k, l)) {
                sum++
            }
        }
    }

    return sum
}

function partB(info) {
    let sum = 0
    return sum
}

console.log(partA(test))
console.log(partA(input))
// console.log('--')
// console.log(partB(test))
// console.log(partB(input))
