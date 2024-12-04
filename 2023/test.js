const fs = require('fs');
const assert = require('assert');
const u = require('./util')

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

console.log(parse2(test)[0])

let g1 = u.newGrid(3, 4)
let g2 = u.newGrid(3, 4, false)

g1.print()
g2.print()

g1[1][2] = 'X'
g2[0][3] = '*'

g1.print()
g2.print()

let g3 = g1.copy()
g3[2][2] = '+'

g1.print()
g3.print()

let g4 = u.newStrGrid(3, 4)
g4.setAt(2, 3, '&')
g4.print()

console.log(g1.neighbors(0, 0))
console.log(g1.neighbors(3, 4))
console.log(g1.indexes())

g1.erase()
g2.erase()
g3.erase()
g4.erase()

g1.print()
g2.print()
g3.print()
g4.print()

console.log([1, 2, 3, 4].powerSet())