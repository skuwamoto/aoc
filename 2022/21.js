const fs = require('fs');

let test = fs.readFileSync('./test21.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input21.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
	let result = {}
	for (let l of lines.split('\n').map(x => x.split(' '))) {
		let key = l.shift().substr(0,4)
		result[key] = (l.length == 1) ? Number(l[0]) : l
	}
	return result
}

function getValue(rules, key) {
	if (Array.isArray(rules[key])) {
		let a = getValue(rules, rules[key][0])
		let b = getValue(rules, rules[key][2])
		
		if (rules[key][1] == '+') rules[key] = a + b
		if (rules[key][1] == '-') rules[key] = a - b
		if (rules[key][1] == '*') rules[key] = a * b
		if (rules[key][1] == '/') rules[key] = a / b
	}
	return rules[key]
}

function getValueAt(rules, hVal, key) {
	let tempRules = Object.assign({}, rules)
	tempRules.humn = hVal
	return getValue(tempRules, key)
}

function partA(rules) {
	return getValue(rules, 'root')
}

function partB(rules) {
	let left = rules.root[0]
	let right = rules.root[2]

	let x1 = 0
	let x2 = 1000

	let f1 = getValueAt(rules, x1, left) - getValueAt(rules, x1, right)
	let f2 = getValueAt(rules, x2, left) - getValueAt(rules, x2, right)

	while (f2 != 0) {
		x1 = x2
		f1 = f2
		x2 = Math.round(x1 - f1 / ((f2-f1)/(x2-x1)))

		f2 = getValueAt(rules, x2, left) - getValueAt(rules, x2, right)
	}  

	return x2
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

