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

function func(arr) {
    let r = []

    for (a of arr) {
        if (a=='0') {
            r.push('1') 
        } else if (a.length % 2 == 0) {
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
    } else if (a == '0') {
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

function func3(map) {
    let r = new Map()

    for (let [k, v] of map.entries()) {
        if (k == '0') {
            r.add('1', v)
        } else if (k.length % 2 == 0) {
            r.add(String(Number(k.substring(0, k.length/2))), v)
            r.add(String(Number(k.substring(k.length/2))), v)
        } else {
            r.add(String(2024 * Number(k)), v)
        }
    }

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

function partB2(info) {
    let map = info.toMap()

    for (let i=0; i<75; i++) {
        map = func3(map)
    }

    return map.sum()
}


console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
console.log('--')
console.log(partB2(test))
console.log(partB2(input))
