const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test8.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input8.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return {
        instr: lines.split('\n\n')[0],
        places: lines.split('\n\n')[1].replace(/[\(\)]/g, '').lsplitMap(' = ', '\n', x => x.split(', '))
    }
}

test = parse(test)
input = parse(input)

// console.log(test)

function partA(lines) {
    sum = 0
    let cur = 'AAA'
    let instr = lines.instr.split('')

    while(cur != 'ZZZ') {
        let ii = instr.shift()
        instr.push(ii)

        cur = lines.places[cur][ii == 'L' ? 0 : 1]
        sum++
    }

    return sum
}

function allZ(cur) {
    for (c of cur) {
        if (c[c.length-1] != 'Z') return false
    }
return true
}

function partB(lines) {
    sum = 0
    let cur = Object.keys(lines.places).filter(x => x[x.length-1] == 'A')
    let instr = lines.instr.split('')

    let seen = []
    let cycles = []
    let firstZ = []
    for (i=0; i < cur.length; i++) {
        seen.push(new Map())
        seen[i].set(cur[i], 0)
        cycles.push(0)
        firstZ.push(0)
    }

    for(step=0; cycles.some(x => x == 0); step++) {
        let ii = instr[step % instr.length]

        // console.log(cur, cycles)

        for (i=0; i < cur.length; i++) {
            let c = cur[i]
            // go to the next place
            cur[i] = (lines.places[cur[i]][ii == 'L' ? 0 : 1])

            c = cur[i]
            let signature = c + step%instr.length

            // see if we hit a cycle.
            if (!cycles[i] && seen[i].has(signature)) {
                cycles[i] = step - seen[i].get(signature)
            }
            // if we haven't seen this yet, record the step where we saw it
            if (!seen[i].has(signature)) {
                seen[i].set(signature, step)
            }
            // If this place ends with z, record it.
            if (c[c.length-1] == 'Z' && !firstZ[i]) {
                firstZ[i] = step
            }
        }
    }

    console.log(cycles)
    console.log(firstZ)
    let prod=1
    for (c of cycles) {
        prod *= c
    }
    return prod
}

// console.log(partA(test))
// console.log(partA(input))
// // console.log('--')
console.log(partB(test))
// console.log(partB(input))
