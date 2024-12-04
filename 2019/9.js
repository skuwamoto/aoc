const fs = require('fs');
const u = require('./util')
const ic = require('./intcode')

let test = fs.readFileSync('./test9.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input9.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split(',').map(Number)
}
function partA(code) {
    let m = new ic.Machine('machine', code)
    m.addInput(1)
    console.log(m.run())
    // m.disassemble()
}

function partB(code) {
    let m = new ic.Machine('machine', code)
    m.addInput(2)
    console.log(m.run())
   m.disassemble()
}

// console.log(partA(parse(test)))
// console.log(partA(parse(input)))
// console.log('--')
// console.log(partB(parse(test)))
console.log(partB(parse(input)))

