const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

let test = fs.readFileSync('./test17.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input17.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(u.parseFloats)
    return { a: BigInt(lines[0][0]), b: BigInt(lines[1][0]), c: BigInt(lines[2][0]), program: lines[4]}
}

test = parse(test)
input = parse(input)

// console.log(test)
// console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

let op = [
    'adv',
    'bxl',
    'bst',
    'jnz',
    'bxc',
    'out',
    'bdv',
    'cdv'
]


function combo(a,b,c,o) {
    switch (o) {
        case 0n:
        case 1n: 
        case 2n:
        case 3n:
            return o
        case 4n:
            return a
        case 5n: 
            return b
        case 6n: 
            return c
        case 7n:
            throw new Error()
    }
}

function partA(info, isPartB = false) {
    let {a, b, c, program} = info

    let out = []
    let debug = false

    if (info.a == parseInt('353322257404257277', 8)) {
        // debug = true
    }

    if (debug) console.log('>>>', a.toString(8),b.toString(8),c.toString(8), out)

    for (let i=0; i < program.length; i+= 2) {
        let p = program[i]
        let o = BigInt(program[i+1])

        let cur = i
        let arg = BigInt(combo(a,b,c,o))

        if (debug) console.log(op[p])
        switch (op[p]) {
        case 'adv':
            a = a >> arg
            // a = Math.floor(a / Math.pow(2, arg))
            break
        case 'bxl':
            b = b^o
            break
        case 'bst':
            b = arg % BigInt(8)
            break
        case 'jnz':
            if (a != 0) {
                i = Number(o) - 2
            }
            break
        case 'bxc':
            b = b^c
            break
        case 'out':
            output = arg % BigInt(8)
            out.push(output)
            break
        case 'bdv':
            b = a >> arg
            // b = Math.floor(a / Math.pow(2, arg))
            break
        case 'cdv':
            c = a >> arg
            // c = Math.floor(a / Math.pow(2, arg))
            break
        }
        if (debug)  console.log(cur, op[p], a.toString(8),b.toString(8),c.toString(8), out)

        if (out.length > 16) break
    }

    return {a, b, c, out: out.join(',')}
}

function partB(info) {
    console.log(info)
    let i=0

    let debug = false
    let found = {}
    for (let registerA = 0; registerA < 0o10000000; registerA++) {
        for (let f of 
[ 
  '562257404257155', '562257404257277',
  '562457404257155', '562457404257277',
  '022257404257155', '022257404257277',
  '622257404257155', '622257404257277',
  '142257404257155', '142257404257277',
  '642257404257155', '642257404257277',
  '646247404257155', '646247404257277',
  '662257404257155', '662257404257277',
  '666247404257155', '666247404257277',
  '666647404257155', '666647404257277',
  '422257404257155', '422257404257277',
  '462257404257155', '462257404257277',
  '442257404257155', '442257404257277'
  ]
            ) {
            let expanded = registerA.toString(8) +  f
            // info.a = parseInt(expanded, 8)
            info.a = BigInt('0o' + expanded)

            // if (debug) console.log('trying', registerA, expanded)
            let {a,b,c,out} = partA(info, true)
            if (out.indexOf('2,4,1,3,7,5,4,2,0,3,1,5,5,5,3,0') == 0 || debug) {
                if (out == '2,4,1,3,7,5,4,2,0,3,1,5,5,5,3,0') return info
                console.log(registerA.toString(8), expanded,out)
                found[expanded.substring(expanded.length-16)] = true
                console.log(Object.keys(found))
            }
        }
    }

    // return

    // while(true) {
    //     if (i%10000 == 0) {
    //         console.log(i)
    //     }
    //     info.a = i
    //     let {a,b,c,out} = partA(info, true)
    //     if (out == info.program.join(','))
    //         return i
    //     i++
    // }
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
console.log(partB(input))
