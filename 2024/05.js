const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test05.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input05.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n\n')
    let rules = {}
    rules.order = lines[0].split('\n').map(x => x.split('|'))
    rules.update = lines[1].split('\n').map(x => x.split(','))

    return rules
}

test = parse(test)
input = parse(input)

// console.log(test)
// console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

function applyRule(r, u) {
    let a = u.indexOf(r[0])
    let b = u.indexOf(r[1])
    if (a != -1 && b != -1 && b < a) return false
    return true
}

function fixRule(r, u) {
    let a = u.indexOf(r[0])
    let b = u.indexOf(r[1])
    if (a != -1 && b != -1 && b < a) { 
        let x = u[a]; 
        u[a] = u[b]; 
        u[b] = x 
    }
    return true
}

function partA(info) {
    let sum = 0

    for (let u of info.update) {
        let good = true
        for (let r of info.order) {
            if (!applyRule(r, u)) good = false
        }
        if (good) sum += Number(u[Math.floor(u.length / 2)])
    }

    return sum
}

function partB(info) {
    let sum = 0

    for (let u of info.update) {
        let good = true
        let changed
        do {
            changed = false
            for (let r of info.order) {
                if (!applyRule(r, u)) good = false
                while (!applyRule(r, u)) {
                    fixRule(r, u)
                    changed = true
                }
            }
        } while (changed)
        if (!good) {
            sum += Number(u[Math.floor(u.length / 2)])
        }
    }

    return sum
}

console.log(partA(test))
console.log(partA(input))
// console.log('--')
console.log(partB(test))
console.log(partB(input))
