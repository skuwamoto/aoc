const fs = require('fs');
const util = require('./util')
const ic = require('./intcode')

let test = fs.readFileSync('./test5.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input5.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split(',').map(Number)
}

function partA(code) {
    let m = new ic.Machine('machine', code)
    m.addInput(1)
    return m.run()
}

function partB(code) {
    let m = new ic.Machine('machine', code)
    m.addInput(5)
    return m.run()
}

// console.log(partA(parse(test)))
// console.log(partA(parse(input)))
console.log('--')
// console.log(partB(parse(test)))
console.log(partB(parse(input)))

