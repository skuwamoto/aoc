const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test6.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input6.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n').map(x => x.after(':').trim().split(/\s+/).map(Number))
}

function parse2(lines) {
    return lines.split('\n').map(x => Number(x.after(':').replace(/\s+/g, '')))
}

function calc(lines) {
    let [time, dist] = lines

    let total = 1
    for (i of time.keys()) {
        t = time[i]
        d = dist[i]

        let ways = 0
        for (pt=1; pt < t-1; pt++) {
            if (pt * (t-pt) > d) ways++
        }
        total *= ways
    }

    return total
}

console.log(calc(parse(test)))
console.log(calc(parse(input)))
console.log('--')
console.log(calc(parse2(test)))
console.log(calc(parse2(input)))
