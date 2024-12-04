const fs = require('fs');

let test = fs.readFileSync('./test11.txt', 'utf8');
let input = fs.readFileSync('./input11.txt', 'utf8');

function strip(s, prefix) {
	return s.substr(prefix.length)
}

function parse(lines) {
	lines = lines.split('\n')

	let result = []
	while (lines.length) {
		result.push({
			count: 0,
			name:lines.shift(),
			items: strip(lines.shift(), '  Starting items: ').split(', ').map(Number),
			oper: strip(lines.shift(), '  Operation: new = '),
			test: 0|strip(lines.shift(), '  Test: divisible by '),
			ifTrue: 0|strip(lines.shift(), '    If true: throw to monkey '),
			ifFalse: 0|strip(lines.shift(), '    If false: throw to monkey '),
		})
		lines.shift() // blank line
	}

	return result
}

// 

function partA(monkeys) {
	for (let r = 0; r < 20; r++) {
		for (let m of monkeys) {
			while (m.items.length) {
				m.count++
				let newVal = eval('old='+m.items[0]+','+m.oper)
				newVal = Math.floor(newVal / 3)
				if (newVal%m.test == 0) {
					monkeys[m.ifTrue].items.push(newVal)
				} else {
					monkeys[m.ifFalse].items.push(newVal)
				}
				m.items.shift()
			}
		}
	}
	monkeys.sort((a,b) => b.count-a.count)
	return monkeys[0].count * monkeys[1].count
}

function partB(monkeys) {
	let factor = 1
	for (let m of monkeys) {
		factor *= m.test
	}

	for (let r = 0; r < 10000; r++) {
		for (let m of monkeys) {
			while (m.items.length) {
				m.count++
				let newVal = eval('old='+m.items[0]+','+m.oper)
				newVal %= factor 
				
				if (newVal%m.test == 0) {
					monkeys[m.ifTrue].items.push(newVal)
				} else {
					monkeys[m.ifFalse].items.push(newVal)
				}
				m.items.shift()
			}
		}
	}
	monkeys.sort((a,b) => b.count-a.count)
	return monkeys[0].count * monkeys[1].count
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

