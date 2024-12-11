const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

let test = fs.readFileSync('./test11.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input11.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split(' ')
}

test = parse(test)
input = parse(input)

// test.print()
console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

function func(arr) {
    let r = []

    for (a of arr) {
        if (a=='0') r.push('1') 
        else if (a.length % 2 == 0) {
            r.push('' + Number(a.substring(0, a.length/2)))
            r.push('' + Number(a.substring(a.length/2)))
        } else {
            r.push('' + 2024 * Number(a))
        }
    }

    return r
}

let map = {}

function func2(a, num) {
    let key = [a,num].join(',')
    if (map[key]) return map[key]

    let r
    if (num == 0) {
        r = 1
    }
    else if (a == '0') {
        r = func2('1', num-1)
    } else if (a.length % 2 == 0) {
        r = func2('' + Number(a.substring(0, a.length/2)), num-1) +
            func2('' + Number(a.substring(a.length/2)), num-1)
    } else {
        r = func2('' + 2024 * Number(a), num-1)
    }

    map[key] = r
    return r
}


function partA(info) {
    let sum = 0

    for (let i=0; i<25; i++) {
        info = func(info)
    }

    return info.length
}

function partB(info) {
    let sum = 0

    for (let a of info) {
        sum += func2(a, 75)
    }

    return sum
}


console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
