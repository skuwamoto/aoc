const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

// let test = fs.readFileSync('./test24.txt', {encoding:'utf8', flag:'r'});
// let medium = fs.readFileSync('./medium24.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input24.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    let [inputs, connections] = lines.split('\n\n')
    inputs = inputs.split('\n').map(x => {
        return {
            key: x.before(':'), 
            val: Number(x.after(' '))
        }
    })

    // Make sure connections are always alphabetical
    connections = connections.split('\n').map(x => {
        let [a, b] = x.split(' -> ')
        let key1 = a.before(' ')
        let oper = a.between(' ', ' ')
        let key2 = a.after(oper + ' ')
        let out = b

        if (key2 < key1) {
            let swap = key1
            key1 = key2
            key2 = swap
        }

        return {key1, oper, key2, out}
    })

    // Rename all connections that look like xnn XOR ynn -> pnn (parity)
    let map = new Map()
    for (let {key1, oper, key2, out} of connections) {
        if (key1.startsWith('x') && key2.startsWith('y') && key1.after('x') == key2.after('y') && !out.startsWith('z')) {
            if (oper == 'XOR') {
                map.set(out, 'P' + key1.after('x'))
            } else if (oper == 'AND') {
                map.set(out, 'A' + key1.after('x'))
            } else {
                map.set(out, 'O' + key1.after('x'))
            }
            // console.log('renaming', out, map.get(out))
        }
    }

    connections = connections.map(x => {
        let {key1, oper, key2, out} = x
        if (map.has(key1)) key1 = map.get(key1)
        if (map.has(key2)) key2 = map.get(key2)
        if (map.has(out))  out = map.get(out)

        if (key2 < key1) {
            let swap = key1
            key1 = key2
            key2 = swap
        }

        return {key1, oper, key2, out}
    })

    for (x of connections) {
        console.log(x.key1, x.oper, x.key2, '->', x.out)
    }

    return {inputs, connections}
}

// test = parse(test)
// medium = parse(medium)
input = parse(input)

// console.log(test)
// console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

function evalAll(info) {
    let {inputs, connections} = info

    let vals = new Map()
    for (let x of inputs) {
        vals.set(x.key, x.val)
    }

    let couldntFinish
    do {
        couldntFinish = false
        for (let x of connections) {
            if (!vals.has(x.out)) {
                if (!vals.has(x.key1) || !vals.has(x.key2)) {
                    couldntFinish = true
                } else {
                    let v1 = vals.get(x.key1)
                    let v2 = vals.get(x.key2)

                    if (x.oper == 'AND') {
                        vals.set(x.out, v1 && v2 ? 1 : 0)
                    } else if (x.oper == 'OR') {
                        vals.set(x.out, v1 || v2 ? 1 : 0)
                    } else if (x.oper == 'XOR') {
                        vals.set(x.out, (v1 && !v2) || (!v1 && v2) ? 1 : 0)
                    }
                }
            }
        }
    } while (couldntFinish)

    return vals
}

function partA(info) {
    let vals = evalAll(info)

    let keys = [...vals.keys()].sort((a,b) => a < b ? 1 : (a > b) ? -1 : 0)

    let sum = 0
    for (let k of keys) {
        if (k.startsWith('z')) {
            sum *= 2
            sum += vals.get(k)
            // console.log(k, '=', vals.get(k))
        }
    }

    return sum
}

function partB(info) {
    let sum = 0
    return sum
}

// console.log(partA(test))
// console.log(partA(medium))
console.log(partA(input))
// console.log('--')
// console.log(partB(test))
// console.log(partB(medium))
// console.log(partB(input))
