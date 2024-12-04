const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test3.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input3.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => x.split(''))
    return lines
}

test = parse(test)
input = parse(input)

function isdigit(c) {
    return c >= '0' && c <= '9'
}

function touching(lines, i, j, len) {
    for (ii=i-1; ii < i+2; ii++) {
        for (jj=j-1; jj < j+len+1; jj++) {
            if (ii >= 0 && ii < lines.length && jj >= 0 && jj < lines[0].length) {
                c = lines[ii][jj]
                if (!isdigit(c) && c != '.') {
                    return true
                }
            }
        }
    }
    return false
}

function getNum(l, j) {
    let r = 0
    for (jj = j; isdigit(l[jj]); jj++) {
        r *= 10
        r += Number(l[jj])
    }
    return r
}

function partA(lines) {
    let sum = 0
    for (i=0; i < lines.length; i++) {
        let l = lines[i]
        for (j=0; j < l.length; j++) {
            if (isdigit(l[j])) {
                let num = getNum(l, j)
                let size = String(num).length
                let isTouching = touching(lines, i, j, size)
                if (isTouching) {
                    // console.log(num, 'touching')
                    sum += num
                } else {
                    // console.log(num, 'not')
                }
                j += size-1
            }
        }
    }
    return sum
}

function partB(lines) {
    let map = lines.copyEmpty(0)
    for (i=0; i < lines.length; i++) {
        let l = lines[i]
        for (j=0; j < l.length; j++) {
            if (isdigit(l[j])) {
                let num = getNum(l, j)
                let size = String(num).length
                for (jj=0; jj<size; jj++) {
                    map[i][j+jj] = num
                }
                j += size-1
            }
        }
    }

    let sum = 0
    for ([i, j, v] of lines.indexes()) {
        if (v == '*') {
            let count = 0
            let ratio = 1
            last = null
            for (val of map.neighborVals(i, j)) {
                if (val && val != last) {
                    count++
                    ratio *= val
                    last = val
                }
            }
            if (count == 2) sum += ratio
        }
    }
    return sum
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
