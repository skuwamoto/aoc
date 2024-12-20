const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

let test = fs.readFileSync('./test19.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input19.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n\n')
    return { towels: lines[0].split(', '), designs: lines[1].split('\n') }
}

test = parse(test)
input = parse(input)

console.log(test)
console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

let cache = new Map()
cache.set('', [])

function isPossible(design, towels) {
    if (cache.has(design)) return cache.get(design)

    // console.log('looking for', design)

    let found = null
    for (let t of towels) {
        // console.log('trying', t)
        if (!found && design.indexOf(t) == 0) {
            // console.log(design, 'starts with', t)
            found = isPossible(design.substring(t.length), towels)
        }
        if (found) {
            found = [t].concat(found)
            break            
        }
    }
    cache.set(design, found)
    return found
}

cache = new Map()
cache.set('', 1)

function allPossible(design, towels) {
    if (cache.has(design)) return cache.get(design)

    let result = 0
    for (let t of towels) {
        let found = 0
        // console.log('trying', t)
        if (design.indexOf(t) == 0) {
            // console.log(design, 'starts with', t)
            found = allPossible(design.substring(t.length), towels)
        }
        if (found) {
            result += found
        }
    }
    cache.set(design, result)
    return result
}

function partA(info) {
    let {towels, designs} = info

    let sum = 0

    for (let d of designs) {
        let result =isPossible(d, towels)
        if (result) {
            console.log(d, '->', result)
            sum++
        } 
    }

    return sum
}

function partB(info) {
    let {towels, designs} = info

    let sum = 0

    for (let d of designs) {
        let result =allPossible(d, towels)
        if (result) {
            console.log(result)
            sum += result
        } 
    }

    return sum
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
console.log(partB(input))
