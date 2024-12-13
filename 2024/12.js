const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

let test = fs.readFileSync('./test12.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input12.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = new Grid( lines.split('\n').map(x => x.split('')) )
    return lines
}

test = parse(test)
input = parse(input)

function findFlood(grid, i, j) {
    let result = [[i, j]]
    let v = grid.getAt(i, j) 

    grid.setAt(i, j, '.')
    for (let [ii, jj] of getNeighbors(i, j)) {
        if (grid.getAt(ii, jj) == v) {
            result = result.concat(findFlood(grid, ii, jj))
        }
    }
    return result
}

function getNeighbors(i, j) {
    return [[i-1, j], [i, j-1], [i+1, j], [i, j+1]]
}

function partA(grid) {
    let sum = 0

    for (let [i,j] of grid.indexes()) {
        let v = grid.getAt(i, j)
        if (v != '.') {
            let these = findFlood(grid, i, j)
            let area = these.length
            let perimiter = 0
            for (let [ii, jj] of these) {
                for (let [iii, jjj] of getNeighbors(ii, jj)) {
                    if (!these.find(x => x[0] == iii && x[1] === jjj)) perimiter++
                }
            }
            console.log(v, area, perimiter)
            sum += area * perimiter
        }
    }

    return sum
}

function countSides(p) {
    let numTouching = 0
    for (let [i, j, d] of p) {
        for (let [ii, jj, dd] of p) {
            if (d == dd && (i == ii && j == jj-1 || i == ii && j == jj+1 || i == ii-1 && j == jj || i == ii+1 && j == jj)) {
                numTouching++
            }
        }
    }
    numTouching /= 2

    return p.length - numTouching
}

function dir(ii, jj, iii, jjj) {
    if (iii-ii == -1) return 'U'
    if (iii-ii == 1) return 'D'
    if (jjj-jj == -1) return 'L'
    if (jjj-jj == 1) return 'R'
}

function partB(grid) {
    let sum = 0

    for (let [i,j] of grid.indexes()) {
        let v = grid.getAt(i, j)
        if (v != '.') {
            let found = findFlood(grid, i, j)
            let area = found.length
            let perimiter = []
            for (let [ii, jj] of found) {
                for (let [iii, jjj] of getNeighbors(ii, jj)) {
                    if (!found.find(x => x[0] == iii && x[1] === jjj)) perimiter.push([iii, jjj, dir(ii, jj, iii, jjj)])
                }
            }

            let sides = countSides(perimiter)

            console.log(v, area, sides)
            sum += area * sides
        }
    }

    return sum
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
console.log(partB(input))
