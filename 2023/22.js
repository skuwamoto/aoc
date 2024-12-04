const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test22.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input22.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => x.split('~').map(x => x.split(',').map(Number)))
    return lines
}

test = parse(test)
input = parse(input)

// console.log(test)
// console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

let letters = ['A','B','C','D','E','F','G']

function clone(info) {
    return JSON.parse(JSON.stringify(info))
}

function intersects(a, b) {
    if (a[1][0] < b[0][0]) return false
    if (b[1][0] < a[0][0]) return false

    if (a[1][1] < b[0][1]) return false
    if (b[1][1] < a[0][1]) return false

    if (a[1][2] < b[0][2]) return false
    if (b[1][2] < a[0][2]) return false


    let hash = {}
    for (let x=a[0][0]; x <= a[1][0]; x++) {
        for (let y=a[0][1]; y <= a[1][1]; y++) {
            for (let z=a[0][2]; z <= a[1][2]; z++) {
                hash[[x,y,z].join(',')] = true
            }
        }
    }

    for (let x=b[0][0]; x <= b[1][0]; x++) {
        for (let y=b[0][1]; y <= b[1][1]; y++) {
            for (let z=b[0][2]; z <= b[1][2]; z++) {
                if (hash[[x,y,z].join(',')]) {
                    // console.log(a, b, 'intersect at', [x,y,z].join(','))
                    return true
                }
            }
        }
    }

    // console.log(a, b, 'do not intersect')
    return false
}

function fall(info, i) {
    let cur = JSON.parse(JSON.stringify(info[i]))
    if (cur[0][2] <= 1) {
        // console.log(letters[i], 'cannot fall because it would hit the floor')
        return null
    }

    cur[0][2] = cur[0][2] - 1
    cur[1][2] = cur[1][2] - 1

    for (let j = 0; j < info.length; j++) {
        if (i != j) {
            if (intersects(cur, info[j])) {
                // console.log(letters[i], 'cannot fall because it would intersect with', letters[j])
                return null
            }
        }
    }

    // console.log(letters[i], 'fell to', cur)
    return cur
}

function draw(info) {
    let g = u.newGrid(10, 3) 
    for (i=0; i<info.length; i++) {
        let l = letters[i]
        let a = info[i]

        for (let x=a[0][0]; x <= a[1][0]; x++) {
            for (let z=a[0][2]; z <= a[1][2]; z++) {
                g[9-z][x] = g[9-z][x] ? '?' : l
            }
        }
    }
    g.print()

    g.erase()
    for (i=0; i<info.length; i++) {
        let l = letters[i]
        let a = info[i]

        for (let y=a[0][1]; y <= a[1][1]; y++) {
            for (let z=a[0][2]; z <= a[1][2]; z++) {
                g[9-z][y] = g[9-z][y] ? '?' : l
            }
        }
    }

    g.print()
}

function partA(info) {
    info = clone(info)

    // First, let everything fall.
    let stillMoving = true
    while (stillMoving) {
        stillMoving = false
        for (let i=0; i < info.length; i++) {
            let ll = fall(info, i)
            if (ll) {
                static = stillMoving = true
                info[i] = ll
            }
        }
    }

    // draw(info)

    console.log('done falling')

    let count = 0

    for (let i=0; i < info.length; i++) {
        let copy = clone(info)
        copy[i][0][2] = -1
        copy[i][1][2] = -1
        console.log('buried', i)        

        let moved = false
        for (let j=0; j < copy.length; j++) {
            if (i != j) {
                if (fall(copy, j)) {
                    moved = true
                    break
                }
            }
        }
        if (!moved) {
            // console.log(letters[i], 'can disintegrate')
            count++
        } else {

        }
    }

    return count
}

function partB(info) {
    info = clone(info)

    // First, let everything fall.
    let stillMoving = true
    while (stillMoving) {
        stillMoving = false
        for (let i=0; i < info.length; i++) {
            let ll = fall(info, i)
            if (ll) {
                stillMoving = true
                info[i] = ll
            }
        }
    }

    // draw(info)

    console.log('done falling')

    let count = 0

    for (let i=0; i < info.length; i++) {
        let copy = clone(info)
        copy[i][0][2] = -1
        copy[i][1][2] = -1
        console.log('buried', i)        

        let moved = {}
        let stillMoving = true
        while (stillMoving) {
            stillMoving = false
            for (let i=0; i < copy.length; i++) {
                let ll = fall(copy, i)
                if (ll) {
                    stillMoving = true
                    copy[i] = ll
                    moved[i] = true
                }
            }
        }

        let delta = Object.keys(moved).length
        if (delta) console.log(delta, 'moved')
        count += delta
    }

    return count
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
console.log(partB(input))
