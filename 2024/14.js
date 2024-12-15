const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

function getChar() {
  let buffer = Buffer.alloc(1)
  fs.readSync(0, buffer, 0, 1)
  return buffer.toString('utf8')
}

let test = fs.readFileSync('./test14.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input14.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n').map( (x) => {
        let [px, py, vx, vy] = u.parseNums(x, false, true) 
        console.log()
        return {px, py, vx, vy}
    })
}

test = parse(test)
input = parse(input)

// console.log(test)
// test.print()

async function partA(info, h, w) {
    let grid = new Grid(h, w)

    for (let i=0; i < 100; i++) {
        for (a of info) {
            a.px += a.vx
            a.py += a.vy

            a.px = (a.px + w) % w
            a.py = (a.py + h) % h
        }
    }

    let sum = [[0,0], [0,0]]

    for (a of info) {
        if (a.px == (w-1)/2) continue
        if (a.py == (h-1)/2) continue

        let i = a.px > (w-1)/2 ? 1 : 0
        let j = a.py > (h-1)/2 ? 1 : 0

        sum[i][j] = sum[i][j]+1
    }    
    return sum[0][0] * sum[0][1] * sum[1][0] * sum[1][1]
}

function partB(info, h, w) {
    let grid = new Grid(h, w)

    let c
    let i=0
    while (c = getChar()) {
        for (a of info) {
            a.px += a.vx
            a.py += a.vy

            a.px = (a.px + w) % w
            a.py = (a.py + h) % h
        }

        console.clear()
        i++
        console.log('after', i, 'seconds')
        grid = new Grid(h, w)

        for (a of info) {
            grid.setAt(a.py, a.px, grid.getAt(a.py, a.px) + 1)
        }

        grid.print()
    }
}

function partC() {
    // n-76 divisible by 103
    // n-4 divisible by 101

    for (let i=1; i < 200 * 200; i++) {
        if ( (i-4) % 101 == 0 && (i-76) % 103 == 0) {
            console.log('found at', i)
            break
        }
    }

}

// console.log(partA(test, 7, 11))
// console.log(partA(input, 103, 101))
// console.log('--')
// console.log(partB(test))
// partB(input, 103, 101)
partC()
