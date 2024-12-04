const fs = require('fs');
const u = require('./util')
const ic = require('./intcode')

let test = fs.readFileSync('./test7.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input7.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split(',').map(Number)
}

function partAA(code) {
    let best = 0
    let bestSeq = ''
    for (seq of [0,1,2,3,4].permute()) {
        let lastOutput = { result: 0 }
        for (let i=0; i < 5; i++) {
            let m = new ic.Machine('machine ' + i, code)
            m.addInput(seq[i])
            m.addInput(lastOutput.result)
            lastOutput = m.run()
        }
        if (lastOutput.result > best) {
            best = lastOutput.result
            bestSeq = seq
        }
    }
    return [best, bestSeq]
}

function partBB(code) {
    let best = 0
    let bestSeq = ''
    for (seq of [5,6,7,8,9].permute()) {
        let lastOutput = { result: 0 }
        let machines = []

        for (let i=0; i < 5; i++) {
            machines.push(new ic.Machine('machine ' + i, code))
            machines[i].addInput(seq[i])
        }

        let isStopped = false
        while (!isStopped) {
            for (let i=0; i < 5; i++) {
                machines[i].addInput(lastOutput.result)
                let out = machines[i].run()
                if (out.opName == 'END') {
                    isStopped = true
                }
                else {
                    lastOutput = out
                }
            }
        }        

        if (lastOutput.result > best) {
            best = lastOutput.result
            bestSeq = seq
        }
    }
    return [best, bestSeq]
}



// console.log(partAA(parse(test)))
// console.log(partAA(parse(input)))
console.log('--')
console.log(partBB(parse(test)))
console.log(partBB(parse(input)))
