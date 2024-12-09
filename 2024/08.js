const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test08.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input08.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    let grid = lines.stringToGrid()
    let found = {}    
    for ([i, j, v] of grid.indexesAndValues()) {
        if (v != '.') {
            if (!found[v]) found[v] = []
            found[v].push([i, j])
        }
    }
    return {grid, found}
}

test = parse(test)
input = parse(input)

// console.log(test)
console.log()

// test.print()

function partA(info) {
    let sum = 0

    let found = {}
    for (let v of Object.keys(info.found)) {
        for (let [i, j] of info.found[v]) {
            for (let [ii, jj] of info.found[v]) {
                if (i != ii || j != jj) {
                    let iii = i - (ii-i)
                    let jjj = j - (jj-j)

                    if (iii >= 0 && iii < info.grid.h() && jjj >= 0 && jjj < info.grid.w()) {
                        info.grid.setAt(iii, jjj, '#')
                        found[[iii,jjj].join(',')] = true
                    }

                    iii = ii - (i-ii)
                    jjj = jj - (j-jj)

                    if (iii >= 0 && iii < info.grid.h() && jjj >= 0 && jjj < info.grid.w()) {
                        info.grid.setAt(iii, jjj, '#')
                        found[[iii,jjj].join(',')] = true
                    }
                }
            }
        }

    }

    info.grid.print()
    return Object.keys(found).length
}

function partB(info) {
    let sum = 0

    for (let v of Object.keys(info.found)) {
        for (let [i, j] of info.found[v]) {
            for (let [ii, jj] of info.found[v]) {
                if (i != ii || j != jj) {
                    let di = (ii-i)
                    let dj = (jj-j)

                    let n=0
                    while (true) {
                        let iii = i + n * di
                        let jjj = j + n * dj
                        if (iii >= 0 && iii < info.grid.h() && jjj >= 0 && jjj < info.grid.w()) {
                            info.grid.setAt(iii, jjj, '#')
                            n++
                        }
                        else {
                            break
                        }
                    }

                    n = -1
                    while (true) {
                        let iii = i + n * di
                        let jjj = j + n * dj
                        if (iii >= 0 && iii < info.grid.h() && jjj >= 0 && jjj < info.grid.w()) {
                            info.grid.setAt(iii, jjj, '#')
                            n--
                        }
                        else {
                            break
                        }
                    }
                }
            }
        }

    }

    info.grid.print()
    return info.grid.count('#')
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
console.log(partB(input))
