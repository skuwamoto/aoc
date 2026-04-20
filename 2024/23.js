const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

let test = fs.readFileSync('./test23.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input23.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n').map(x => x.split('-'))
}

test = parse(test)
input = parse(input)

console.log(test)
console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

function makeMap(info) {
    let map = new Map()

    for (let [from, to] of info) {
        if (!map.has(from)) map.set(from, new Set())
        if (!map.has(to)) map.set(to, new Set())

        map.get(from).add(to)
        map.get(to).add(from)
    }
    return map
}

function makeKey(arr) {
    arr = arr.unique()
    arr.sort()
    return arr.join(',')
}

function partA(info) {
    let map = makeMap(info)
    let parties = new Map()

    // Get map of all parties
    for (let first of map.keys()) {
        for (let second of map.get(first).values()) {
            for (let third of map.get(first).values()) {
                // console.log('second', second)
                if (second != third) {
                    let key = makeKey([first, second, third])
                    if (!parties.get(key)) {
                        parties.se
                        t(key, map.get(second).has(third))
                    }
                }
            }
        }
    }

    let sum = 0
    for (let p of parties.keys()) {
        if (parties.get(p)) {
            // console.log(p, 'is a party')
            if (p.startsWith('t') || p.indexOf(',t') != -1) {
                sum++
                // console.log('>>>>>>> has t')
            }
        }
    }

    return sum
}

function canMerge(map, arr, next) {
    for (let p of arr) {
        if (!map.get(p).has(next)) {
            return false
        }
    }
    return true
}

function partB(info) {
    let map = makeMap(info)
    let parties = new Set()

    // Make the list of initial sized parties
    for (let [from, to] of info) {
        parties.add(makeKey([from, to]))
    }

    let added
    do {
        added = false
        let nextParties = new Set()
        for (let p of parties) {
            let pArray = p.split(',')
            for (let m of map.keys()) {

                if (canMerge(map, pArray, m)) {
                    pArray.push(m)
                    let newKey = makeKey(pArray)
                    pArray.pop()

                    nextParties.add(newKey)
                    added = true
                }
            }
        }
        if (added) {
            parties = nextParties
            console.log(parties)
        }
    } while(added)
    console.log(parties.keys())
}


// console.log(partA(test))
// console.log(partA(input))
console.log(partB(test))
console.log('--')
console.log(partB(input))
