const fs = require('fs');
const {Grid} = require('./util2')

let test = fs.readFileSync('./test06.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./sean06.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return new Grid(lines)
}

test = parse(test)
input = parse(input)

test.print()
console.log()

function partA(info) {
    let c = '^'
    let [i, j] = info.find(c)
    while (i >= 0 && i < info.h && j >= 0 && j <= info.w) {
        switch (c) {
        case '^':
            if (info.getAt(i-1, j) == '#') {
                c = '>'
            } else {
                info.setAt(i, j, 'X')
                i--
            }
            break;
        case '>':
            if (info.getAt(i, j+1) == '#') {
                c = 'v'
            } else {
                info.setAt(i, j, 'X')
                j++
            }
            break;
        case 'v':
            if (info.getAt(i+1, j) == '#') {
                c = '<'
            } else {
                info.setAt(i, j, 'X')
                i++
            }
            break;
        case '<':
            if (info.getAt(i, j-1) == '#') {
                c = '^'
            } else {
                info.setAt(i, j, 'X')
                j--
            }
            break;
        }
    }

    return info.count('X')
}


function isLoop(grid) {
    let c = '^'
    let [i, j] = grid.find(c)
    grid.setAt(i, j, '.')

    while (i >= 0 && i < grid.h && j >= 0 && j <= grid.w) {
        switch (c) {
        case '^':
            if (grid.getAt(i-1, j) == '#') {
                c = '>'
            } else {
                if (grid.getAt(i, j) == '^') return true
                grid.setAt(i, j, '^')
                i--
            }
            break;
        case '>':
            if (grid.getAt(i, j+1) == '#') {
                c = 'v'
            } else {
                if (grid.getAt(i, j) == '>') return true
                grid.setAt(i, j, '>')
                j++
            }
            break;
        case 'v':
            if (grid.getAt(i+1, j) == '#') {
                c = '<'
            } else {
                if (grid.getAt(i, j) == 'v') return true
                grid.setAt(i, j, 'v')
                i++
            }
            break;
        case '<':
            if (grid.getAt(i, j-1) == '#') {
                c = '^'
            } else {
                if (grid.getAt(i, j) == '<') return true
                grid.setAt(i, j, '<')
                j--
            }
            break;
        }
    }

    return false
}

function partB(info) {
    let start = Date.now()
    let sum = 0
    for ([i, j, v] of info.indexes()) {

        if (v != '.') continue

        let thisInfo = info.copy()
        thisInfo.setAt(i, j, '#')
        if (isLoop(thisInfo)) {
            console.log('loop at', i, j)
            sum++
        }
    }

    console.log('time:', '' + (Date.now() - start) + 'ms')
    return sum
}




// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
console.log(partB(input))
