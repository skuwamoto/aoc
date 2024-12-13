const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

let test = fs.readFileSync('./test13.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input13.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n\n').map(x => { 
        // let l = x.split('\n'); 
        // let xa = l[0].between('X+', ',')
        // let ya = l[0].after('Y+') 

        // let xb = l[1].between('X+', ',')
        // let yb = l[1].after('Y+') 

        // let xp = l[2].between('X=', ',')
        // let yp = l[2].after('Y=')

        let [[xa, ya], [xb, yb], [xp, yp]] = x.split('\n').map(u.parseNums)

        return {a: [Number(xa), Number(ya)], b: [Number(xb), Number(yb)], p: [Number(xp), Number(yp)]}
    }) 

    return lines
}

test = parse(test)
input = parse(input)

function partA(info) {
    let sum = 0

    for (let {a, b, p} of info) {
        let best = 0

        for (let i=0; i <= 100; i++) {
            for (let j=0; j <= 100; j++) {
                if (i * a[0] + j * b[0] == p[0] && i * a[1] + j * b[1] == p[1]) {
                    let cur = 3 * i + j
                    if (!best) {
                        best = cur
                    } else if (cur < best) {
                        best = cur
                        console.log('found better one')                        
                    }
                }
            }
        }
        sum += best
    }

    return sum
}

// n ax + m bx = px
// n ay + m by = py

// (n ay + m by) * bx / by = py * bx / by

// n ax + m bx = px
// n ay * bx / by + m bx = py * bx / by

// n (ax - ay*bx/by) = px-py * bx / by
// n = (px-py * bx / by) / (ax - ay*bx/by)

// m = (px - n ax) / bx


function nearInt(x) {
    return (Math.abs(x - Math.round(x)) < 0.01) 
}

function partB(info) {
    let sum = 0

    for (let {a, b, p} of info) {
        p[0] += 10000000000000
        p[1] += 10000000000000

        numA = (p[0]-p[1] * b[0] / b[1]) / (a[0] - a[1] * b[0]/b[1])
        numB = (p[0] - numA * a[0]) / b[0]

        if (nearInt(numA) && nearInt(numB)) {
            sum += Math.round(numA) * 3 + Math.round(numB)
        } else {
            // console.log('miss', numA, numB)
        }
    }

    return sum
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
