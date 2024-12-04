const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test13.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input13.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n\n').map(x => x.split('\n'))
    return lines
}

test = parse(test)
input = parse(input)

function vertReflect(m, j) {
    for (jj = 0; j-jj >= 0 && j+jj+1 < m.w(); jj++) {
        if (!m.col(j-jj).arrEquals(m.col(j+jj+1))) return false
    }
    return true
}

function horzReflect(m, i) {
    for (ii = 0; i-ii >= 0 && i+ii+1 < m.h(); ii++) {
        if (m[i-ii] != (m[i+ii+1])) return false
    }
    return true
}

function getScore(m, ignoreScore) {
    for (let j=0; j < m.w()-1; j++) {
        if (vertReflect(m, j)) {
            if (!ignoreScore || j+1 != ignoreScore) {
                return j+1
            }
        }
    }

    for (let i=0; i < m.h()-1; i++) {
        if (horzReflect(m, i)) {
            if (!ignoreScore || (i+1)*100 != ignoreScore) {
                return (i+1) * 100
            }
        }
    }

    return -1
}

function partA(maps) {
    let sum = 0
    let i = 1
    for (m of maps) {
        sum += getScore(m)
    }
    return sum
}

function partB(maps) {
    let sum = 0
    for (m of maps) {
        let found = false
        let score = getScore(m)
        let newScore = 0
        for (let i=0; !found && i < m.h(); i++) {
            for (let j=0; !found && j < m.w(); j++) {
                m.setAt(i, j, m[i][j] == '#' ? '.' : '#')
                newScore = getScore(m, score)
                m.setAt(i, j, m[i][j] == '#' ? '.' : '#')

                if (newScore != -1) {
                    found = true
                }
            }
        }
        sum += newScore
    }
    return sum
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
console.log(partB(test))
console.log(partB(input))
