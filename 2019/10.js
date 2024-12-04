const fs = require('fs');
const u = require('./util')
const ic = require('./intcode')

let test = fs.readFileSync('./test10.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input10.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    let result = lines.stringToGrid()
    result.print()
    return result
}

function isBlocked(g, i, j, ii, jj) {
    if (i == ii && j == jj) return true

    let debug = false
    if (i == 2 && j == 0) debug = true

    if (debug) console.log('checking', i, j, ii, jj)
    let deltaI = ii - i
    let deltaJ = jj - j

    if (debug) console.log('deltas', deltaI, deltaJ)

    if (deltaI == 0) deltaJ = Math.sign(deltaJ) 
    else if (deltaJ == 0) deltaI = Math.sign(deltaI)
    else {
        let gcd = u.gcd2(Math.abs(deltaI), Math.abs(deltaJ))
        deltaI /= gcd
        deltaJ /= gcd
    }

    if (debug) console.log('>>>>>>', deltaI, deltaJ)

    let iii = i
    let jjj = j

    while (iii += deltaI, jjj += deltaJ, (iii != ii || jjj != jj)) {
        if (debug) console.log('at', iii, jjj)
        if (g[iii][jjj] == '#') return true
    }

    return false
}

function partA(g) {
    let best = 0
    let bestPos = null

    for ([i, j] of g.indexes()) {
        if (g[i][j] == '#') {
            let count = 0;
            for ([ii, jj] of g.indexes()) {
                if (g[ii][jj] == '#' && !isBlocked(g, i, j, ii, jj)) {
                    count++
                }
            }
            if (count > best) {
                best = count
                bestPos = [i, j]
            }
        }
    }

    return [best, bestPos]
}

function getAngle(posI, posJ, i, j) {
    let angle = Math.atan2(j-posJ, posI-i)
    if (angle < 0) angle += 2 * Math.PI
    return angle
}

function angleBetween(prevAngle, angle) {
    angle -= prevAngle
    if (angle < 0) angle += 2 * Math.PI
    return angle
}


let epsilon = 0.0000000000000000000001

function partB(g) {
    let [score, [posI, posJ]] = partA(g)

    console.log(posJ, posI)

    let numDestroyed = 0
    let prevAngle = -2 * epsilon

    let bestI, bestJ
    while (numDestroyed < 200) {
        let bestAngle = null
        for ([i, j] of g.indexes()) {
            if (!isBlocked(g, posI, posJ, i, j) && g[i][j] == '#') {
                let angle = getAngle(posI, posJ, i, j)
                let between = angleBetween(prevAngle, angle)

                if (Math.abs(between) > epsilon && (bestAngle == null || between < bestBetween)) {
                    bestBetween = between
                    bestAngle = angle
                    bestI = i
                    bestJ = j
                }
            }
        }
        numDestroyed++
        g[bestI][bestJ] = String((numDestroyed-1)%9+1)

        console.log(numDestroyed, 'destroyed at (', bestJ, ',', bestI, ')', bestAngle)

        prevAngle = bestAngle

        // g.print()
    }

    return bestJ * 100 + bestI
}

// console.log(partA(parse(test)))
// console.log(partA(parse(input)))
// console.log('--')
// console.log(partB(parse(test)))
console.log(partB(parse(input)))

