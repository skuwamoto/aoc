const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test6.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input6.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n').map(x => x.after(':').trim().split(/\s+/).map(Number))
}

function parse2(lines) {
    return lines.split('\n').map(x => Number(x.after(':').trim().replace(/\s+/g, '')))
}

function partA(lines) {
    let [time, dist] = lines

    let total = 1
    for (i of time.keys()) {
        t = time[i]
        d = dist[i]

        let ways = 0
        for (pressed=1; pressed < t-1; pressed++) {
            dd = pressed * (t-pressed)
            if (dd > d) ways++
        }
        total *= ways
    }

    return total
}

function partB(lines) {
    let [t, d] = lines

    let ways = 0
    for (pressed=1; pressed < t-1; pressed++) {
        dd = pressed * (t-pressed)
        if (dd > d) ways++
    }

    return ways
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse2(test)))
console.log(partB(parse2(input)))
