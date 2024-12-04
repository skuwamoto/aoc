const fs = require('fs');
const util = require('util')

let test = fs.readFileSync('./test3.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input3.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n').map(x => x.split(','))
}

let d = {
    R: {x: 1, y: 0},
    L: {x: -1, y: 0},
    U: {x: 0, y: -1},
    D: {x: 0, y: 1}
}

function dist(k) {
    let [x, y] = k.split(',')
    return Math.abs(Number(x)) + Math.abs(Number(y))
}

function steps(map, k) {
    let [xx, yy] = k.split(',')
    let steps = 0
    let x = 0
    let y = 0

    for (s of map) {
        let dir = s[0]
        let num = Number(s.substr(1))
        for (let i=0; i < num; i++) {
            x += d[dir].x
            y += d[dir].y
            steps += 1
            if (x == xx && y == yy) return steps
        }
    }
    throw new Error('')
}

function fill(map, x, y) {
    map[x + "," + y] = true
}

function getCombined(lines) {
    let maps = []
    for (let ii = 0; ii < 2; ii++) {
        let map = {}
        let x = 0
        let y = 0

        for (s of lines[ii]) {
            let dir = s[0]
            let num = Number(s.substr(1))
            for (let i=0; i < num; i++) {
                x += d[dir].x
                y += d[dir].y
                fill(map, x, y)
            }
        }
        maps.push(map)
    }

    let combined = {}
    for (map of maps) {
        for (k in map) {
            if (!combined[k]) {
                combined[k] = 0
            } else {
                console.log('cross at', k)
            }
            combined[k] = combined[k] + 1
        }
    }
    return [maps, combined]
}

function partA(lines) {
    let [maps, combined] = getCombined(lines)

    let best = null
    for (k in combined) {
        if (combined[k] > 1) {
            if (!best) best = k
            if (dist(k) < dist(best)) best = k
        }
    }
    return dist(best)
}

function partB(lines) {
    let [maps, combined] = getCombined(lines)
    
    let best = null
    for (k in combined) {
        if (combined[k] > 1) {
            if (!best) best = k
            if (steps(lines[0], k) + steps(lines[1], k) < steps(lines[0], best) + steps(lines[1], best)) best = k
        }
    }
    return steps(lines[0], best) + steps(lines[1], best)
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

