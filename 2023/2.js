const fs = require('fs');
const util = require('./util')

let test = fs.readFileSync('./test2.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input2.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => x.split(':'))
    let result = []
    for (l of lines) {
        num = Number(l[0].substr(5))
        turns = l[1].split(';')
        let tt = []
        for (turn of turns) {
            map = {}
            zz = turn.split(',')
            for (z of zz) {
                z = z.trim()
                n = Number(z.split(' ')[0])
                color = z.split(' ')[1]
                map[color] = n
            }
            tt.push(map)
        }
        result.push({
            id: num,
            turns: tt
        })
    }

    return result
}

function parse2(lines) {
    return lines.split('\n').map(x => 
        ({
            id: Number(x.between('Game ', ':')),
            turns: x.after(':').split(';').map(y => y.rsplitMap(' ', ',', Number))
        })
    )
}

test = parse(test)
input = parse(input)

console.log('parse', test)

let max = {
    red: 12,
    green: 13,
    blue: 14
}

function partA(lines) {
    let result = 0
    for (let l of lines) {
        bad = false
        for (let t of l.turns) {
            if (t.red > max.red || t.green > max.green || t.blue > max.green) {
                bad = true
            }
        }
        if (!bad) {
            result += l.id
        }
    }

    return result
}

function partB(lines) {
    let result = 0
    for (let l of lines) {
        let max = {red: 0, green: 0, blue: 0}
        for (let t of l.turns) {
            if (t.red > max.red) max.red = t.red
            if (t.green > max.green) max.green = t.green
            if (t.blue > max.blue) max.blue = t.blue
        }
        result += max.red * max.green * max.blue
    }

    return result
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
