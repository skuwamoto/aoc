const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test12.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input12.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => x.split(' '))
    return {
        codes: lines.map(x => x[0]),
        damaged: lines.map(x => x[1].split(',').map(Number))
    }
}

test = parse(test)
input = parse(input)

console.log(test)
console.log()

function matches(str, damaged) {
    if (str.includes('?')) return false

    // console.log("trying", str)
    str = str.trimChar('.')
    list = str.split(/\.+/).map(x => x.length)

    // console.log('matching', list, damaged)
    if (list.length != damaged.length) return false
    for (i=0; i < list.length; i++) {
        if (list[i] != damaged[i]) return false
    }
    return true
}

function partA(info) {
    let {codes, damaged} = info

    let sum = 0
    for (ii of codes.keys()) {
        let c = codes[ii]
        let d = damaged[ii]
        let dNeed = d.sum()

        let count = 0;
        let unk = []
        let dFound = 0
        for (let i=0; i < c.length; i++) {
            if (c[i] == '?') unk.push(i)
            if (c[i] == '#') dFound++
        }

        // console.log('code', c, 'unknowns', unk)

        for (formula of unk.powerSet()) {
            if (formula.length != dNeed-dFound) continue
            let cc = c.split('')
            for (j of unk) {
                cc[j] = formula.includes(j) ? '#' : '.'
            }
            cc = cc.join('')
            if (matches(cc, d)) {
                count++
            }
        }
        sum += count
    }

    return sum
}

let hash = new Map()

function trimMatches(code, damaged) {
    code = code.trimChar('.')
    list = code.split(/\.+/)

    if (code.length == 0 && damaged.length == 0) {
        return {possible: true, code, damaged}
    }

    // see how many parts of the beginning match
    possible = true
    for (i=0; i < list.length; i++) {
        if (list[i].includes('?')) {
            possible = true
            break
        }
        if (list[i].length != damaged[i]) {
            possible = false
            break
        }
    }

    if (i != 0) {
        code = list.slice(i).join('.')
        damaged = damaged.slice(i)
    }

    if (code.length == 0 && damaged.length > 0) possible = false

    return { possible, code, damaged }
}

function getCount(c, d) {
    let key = c + ':' + d.join(',')
    // console.log('looking up', c, d)

    // Return early if cached
    if (hash.has(key)) return hash.get(key)

    let result = null

    // Trim off known values at the front and end.
    let {possible, code, damaged} = trimMatches(c, d)

    c = code
    d = damaged

    let count = 0

    if (!possible) {
        count = 0
    }
    else if (c.length == 0 && d.length == 0) {
        // console.log('found!!!')
        count = 1
    } else {
        // Fix the first question mark and recurse.
        for (let i=0; i < c.length; i++) {
            if (c[i] == '?') {
                // console.log('found!')
                count += getCount(c.replaceAt(i, '.'), d)
                count += getCount(c.replaceAt(i, '#'), d)
                break
            }
        }
    }

    hash.set(key, count)
    return count
}

function partAA(info) {
    let {codes, damaged} = info

    let sum = 0
    for (i of codes.keys()) {
        let count = getCount(codes[i], damaged[i])
        sum += count
    }

    return sum

}

function partB(info) {
    let {codes, damaged} = info

    codes = codes.map(x => [x, x, x, x, x].join('?'))
    damaged = damaged.map(x => x.concat(x).concat(x).concat(x).concat(x))

    return partAA({codes, damaged})
}

console.log(partA(test))
// console.log(partA(input))
// console.log('--')
console.log(partB(test))
console.log(partB(input))
