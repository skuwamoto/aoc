const fs = require('fs');
const util = require('util')

let test = fs.readFileSync('./test6.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input6.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n').map(x => x.split(')'))
}


function makeGraph(lines) {
    let parents = {}
    for ([p, c] of lines) {
        parents[c] = p
    }
    return parents
}

function partA(lines) {
    let count = 0
    let p = makeGraph(lines)
    for (k in p) {
        let pp = p[k]
        while (pp) {
            count++
            pp = p[pp]
        }
    }
    return count
}

function partB(lines) {
    let p = makeGraph(lines)
    let sanDist = {}
    let pp = p['SAN']
    
    let dist = 0
    while (pp) {
        sanDist[pp] = dist
        pp = p[pp]
        dist++
    }

    pp = p['YOU']
    dist = 0

    while (pp && !sanDist[pp]) {
        pp = p[pp]
        dist++        
    }

    return dist + sanDist[pp]
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(input)))

