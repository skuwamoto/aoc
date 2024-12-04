const fs = require('fs');
const util = require('util')

let test = fs.readFileSync('./test2.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input2.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split(',').map(Number)
}

function run(code) {
    let pc = 0;
    while ((op=code[pc])) {
        if (op == 1) {
            code[code[pc+3]] = code[code[pc+1]] + code[code[pc+2]]
            pc += 4
        } else if (op == 2) {
            code[code[pc+3]] = code[code[pc+1]] * code[code[pc+2]]
            pc += 4
        } else if (op == 99) {
            break
            // halt
        } else {
            console.log('error')
            throw new Error(op)
        }
    }
    return code
}

function partA(code) {
    code[1] = 12
    code[2] = 2
    code = run(code)
    console.log(code)
    return code[0]
}

function partB(code) {
    for (noun=0; noun<100; noun++) {
        for (verb=0; verb<100; verb++) {
            let c = code.concat()
            c[1] = noun
            c[2] = verb
            c = run(c)
            if (c[0] == 19690720) {
                return (100 * noun + verb)
            }
        }
    }
    throw new Error('asdf')
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(input)))

