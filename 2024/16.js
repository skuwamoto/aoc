const fs = require('fs');
const {Grid} = require('./util2')

let test = fs.readFileSync('./test16.txt', {encoding:'utf8', flag:'r'});
let medium = fs.readFileSync('./medium16.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input16.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = new Grid( lines.split('\n').map(x => x.split('')) )
    return lines
}

test = parse(test)
medium = parse(medium)
input = parse(input)

let delta = {
    '>': [0, 1],
    '<': [0, -1],
    '^': [-1, 0],
    'v': [1, 0]
}

let turn = {
    '>': ['^', 'v'],
    '<': ['v', '^'],
    '^': ['<', '>'],
    'v': ['>', '<']
}

function add(v1, v2) {
    return [v1[0]+v2[0], v1[1]+v2[1]]
}

let MAX = 10000000000000000000

function findShortest(grid, cur, dir, scoreSoFar, best) {
    // If we got to the end, return the score and all of the squares that we traversed.
    if (grid.getAt(cur) == 'E') {
        return { 
            score: scoreSoFar, 
            paths: grid.findAll((v) => { 
                return 'S><^vE'.indexOf(v) != -1 
            }) 
        }
    }

    // Look up the best score so far for our state, which is keyed by the current position and direction
    let key = cur.join(',') + dir

    // If the best score is better than what we have done so far, then we have failed.
    if (best.get(key) && best.get(key) < scoreSoFar) {
        return { score: MAX, paths: [] }
    }

    // If the square is not empty, we have failed.
    if (grid.getAt(cur) != '.' && grid.getAt(cur) != 'S') {
        return { score: MAX, paths: [] }
    }

    // Store the score so far as the best score for this key.
    best.set(key, scoreSoFar)

    // We record path information in the grid itself as we recurse, in order
    // to avoid memory allocation
    
    // Fill a square, try going forward and erase the square.
    grid.setAt(cur, dir)
    let next1 = findShortest(grid, add(cur, delta[dir]), dir, scoreSoFar+1, best)
    grid.setAt(cur, '.')

    // Fill a square, try going left and erase the square.
    let dir2 = turn[dir][0]
    grid.setAt(cur, dir2)
    let next2 = findShortest(grid, add(cur, delta[dir2]), dir2, scoreSoFar+1001, best)
    grid.setAt(cur, '.')

    // Fill a square, try going right and erase the square.
    let dir3 = turn[dir][1]
    grid.setAt(cur, dir3)
    let next3 = findShortest(grid, add(cur, delta[dir3]), dir3, scoreSoFar+1001, best)
    grid.setAt(cur, '.')

    // Sort the scores of the three trials.
    let found = [next1, next2, next3]
    found.sort((a,b) => a.score - b.score)

    // Add up all the paths for the trials that have the same score.
    let paths = []
    if (found[0].score < MAX) {
        paths = paths.concat(found[0].paths)
        if (found[1].score == found[0].score) {
            paths = paths.concat(found[1].paths)
        }
        if (found[2].score == found[0].score) {
            paths = paths.concat(found[2].paths)
        }
    }

    // Return the best score and paths.
    return { score: found[0].score, paths: paths }
}


function partA(grid) {
    grid = grid.copy()

    let cur = grid.find('S')

    let best = new Map()
    return findShortest(grid, cur, '>', 0, best).score
}

function partB(grid) {
    grid = grid.copy()

    let cur = grid.find('S')

    let best = new Map()
    let result = findShortest(grid, cur, '>', 0, best)

    for (let p of result.paths) {
        grid.setAt(p, 'O')
    }
    // grid.print()

    return grid.findAll('O').length
}

console.log(partA(test))
console.log(partA(medium))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(medium))
console.log(partB(input))
