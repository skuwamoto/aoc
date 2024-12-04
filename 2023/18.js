const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test18.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input18.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => x.split(' ')).map(x => ({d: x[0], n: Number(x[1]), color: x[2].between('(', ')')}))
    return lines
}

test = parse(test)
input = parse(input)

let delta = {
    R: [0, 1],
    L: [0, -1],
    U: [-1, 0],
    D: [1, 0]
}

function makeMap(lines, w, h) {
    let g = u.newGrid(w, h)
    let i = Math.floor(w/2)
    let j = Math.floor(h/2)

    g[i][j] = '#000000'

    for (l of lines) {
        let {d, n, color} = l
        let dd = delta[d]

        for (let k = 0; k < n; k++) {
            i += dd[0]
            j += dd[1]
            if (i < 0 || j < 0 || i >= h || j >= w) {
                console.log('oh no!', i, j)
                throw "xxx"
            } 
            g[i][j] = color
        }
    }

    return g
}

function flood(g, i, j) {
    let stack = [[i, j]]

    while (stack.length) {
        let [ii, jj] = stack.pop()
        if (!g[ii][jj]) {
            g[ii][jj] = '#'

            for ([iii, jjj] of g.neighbors(ii, jj)) {
                stack.push([iii, jjj])
            }
        }
    }
}

function partA(lines) {
    let g = makeMap(lines, 500, 500) 
    flood(g, 0, 0)

    g.mapGrid(x => x=='#' ? '#' : null).print()

    count = 0
    for (i=0; i < g.h(); i++) {
        for (j=0; j < g.w(); j++) {
            if (g[i][j] !== '#') count++
        }
    }

    return count
}

let dir = {
    '0': 'R',
    '1': 'D',
    '2': 'L',
    '3': 'U'
}

function hexToNum(s) {
    return parseInt(s, 16)
}

function makeMap2(lines) {
    let i=0;
    let j=0;

    let iSet = []
    let jSet = []

    // Add all coordinates we see (the 1x1 box around each stopping point)
    for (l of lines) {
        let {d, n} = l
        let dd = delta[d]

        i += delta[d][0] * n
        j += delta[d][1] * n

        iSet.push(i)
        iSet.push(i+1)
        jSet.push(j)
        jSet.push(j+1)
    }

    // Sort into order
    iSet.sort((a, b) => a-b)
    jSet.sort((a, b) => a-b)

    iSet = iSet.unique()
    jSet = jSet.unique()

    // Add a buffer item on top and left
    iSet.unshift(iSet[0]-1)
    jSet.unshift(jSet[0]-1)

    // Make a grid with this many items.
    let grid = u.newGrid(iSet.length, jSet.length)

    i = 0
    j = 0

    // Add all coordinates we see (the 1x1 box around each stopping point)
    for (l of lines) {
        let {d, n} = l
        let dd = delta[d]

        ii = iSet.indexOf(i)
        jj = jSet.indexOf(j)

        grid[ii][jj] = true

        let iNext = i + n * dd[0]
        let jNext = j + n * dd[1]

        while (ii += dd[0], jj += dd[1], !(iSet[ii] == iNext && jSet[jj] == jNext)) {
            grid[ii][jj] = true
        }

        grid[ii][jj] = true

        i = iNext
        j = jNext
    }

    return { grid, iSet, jSet }
}

function partB(lines) {
    lines = lines.map(x => ({ d: dir[x.color[6]], n: hexToNum(x.color.substr(1, 5)) })) 
    let {grid, iSet, jSet} = makeMap2(lines)

    flood(grid, 0, 0)

    count = 0
    for (i=0; i < grid.h(); i++) {
        for (j=0; j < grid.w(); j++) {
            if (grid[i][j] !== '#'){
                count += (iSet[i+1]-iSet[i]) * (jSet[j+1]-jSet[j])
            } 
        }
    }

    return count
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
console.log(partB(input))
