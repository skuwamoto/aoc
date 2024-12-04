const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test19.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input19.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    let [rules, parts] = lines.split('\n\n')

    rules = rules.lsplitMap('{', '\n', x => x.before('}').split(','))
    parts = parts.split('\n').map(x => x.between('{', '}').lsplitMap('=',',', Number))

    return {rules, parts}
}

test = parse(test)
input = parse(input)

console.log(test)
console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

function partA(info) {
    let {rules, parts} = info
    let sum = 0

    for (p of parts) {
        let next = 'in'
        while (next != 'A' && next != 'R') {
            for (r of rules[next]) {
                if (r.includes('>')) {
                    let key = r.before('>')
                    let val = Number(r.between('>', ':'))
                    next = r.after(':')
                    if (p[key] > val) {
                        break
                    }
                } else if (r.includes('<')) {
                    let key = r.before('<')
                    let val = Number(r.between('<', ':'))
                    next = r.after(':')
                    if (p[key] < val) {
                        break
                    }
                } else {
                    next = r
                    break
                }
            }
        }
        if (next == 'A') sum += p.x + p.m + p.a + p.s
    }

    return sum
}

function partB(info) {
    let {rules, parts} = info

    let q = [{next: 'in', x: [0, 4001], m: [0, 4001], a: [0, 4001], s: [0, 4001]}]
    let result = []

    function maybeAdd(nextQ) {
        if (nextQ.next == 'R') {
            // do nothing
        } else if (nextQ.next == 'A') {
            result.push(nextQ)
        } else {
            q.push(nextQ)
        }
    }

    while (q.length) {
        let qq = q.shift()
        // console.log('>>> next', qq)
        for (r of rules[qq.next]) {
            if (r.includes('>')) {
                let key = r.before('>')
                let val = Number(r.between('>', ':'))
                let next = r.after(':')

                let qqNext = {next: next, x: qq.x.concat(), m: qq.m.concat(), a: qq.a.concat(), s: qq.s.concat()}
                if (val > qqNext[key][0]) {
                    qqNext[key][0] = val
                }
                maybeAdd(qqNext)
                if (val+1 < qq[key][1]) {
                    qq[key][1] = val+1
                }
            } else if (r.includes('<')) {
                let key = r.before('<')
                let val = Number(r.between('<', ':'))
                let next = r.after(':')

                let qqNext = {next: next, x: qq.x.concat(), m: qq.m.concat(), a: qq.a.concat(), s: qq.s.concat()}
                if (val < qqNext[key][1]) {
                    qqNext[key][1] = val
                }
                maybeAdd(qqNext)
                if (val-1 > qq[key][0]) {
                    qq[key][0] = val-1
                }
            } else {
                let qqNext = {next: r, x: qq.x.concat(), m: qq.m.concat(), a: qq.a.concat(), s: qq.s.concat()}
                maybeAdd(qqNext)
            }
        }
    }
    console.log(result)

    let sum = 0
    for (r of result) {
        sum += (r.x[1]-r.x[0]-1) * (r.m[1]-r.m[0]-1) * (r.a[1]-r.a[0]-1) * (r.s[1]-r.s[0]-1)
    }

    return sum
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
console.log(partB(input))
