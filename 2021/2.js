const fs = require('fs');

let test = fs.readFileSync('./test2.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input2.txt', {encoding:'utf8', flag:'r'});

test = test.split('\n')
input = input.split('\n')

function partA(a) {
    let h = 0
    let d = 0

    for (line of a) {
        let [inst, n] = line.split(' ')
        n = Number(n)
        if (inst == 'forward') h += n
        else if (inst == 'down') d += n
        else if (inst == 'up') d -= n
    }

    return d * h
}

function partB(a) {
    let h = 0
    let d = 0
    let aim = 0

    for (line of a) {
        let [inst, n] = line.split(' ')
        n = Number(n)

        if (inst == 'forward') {
            h += n
            d += aim * n
        }
        else if (inst == 'down') aim += n
        else if (inst == 'up') aim -= n
    }

    return d * h
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))

