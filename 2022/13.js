const fs = require('fs');

let test = fs.readFileSync('./test13.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input13.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
	return lines.split('\n\n').map(x => x.split('\n'))
}
function parse2(lines) {
	return lines.replace(/\n\n/g, '\n').split('\n')
}

function compare(left, right) {
	left = typeof left == 'string' ? JSON.parse(left) : left
	right = typeof right == 'string' ? JSON.parse(right) : right

	if (typeof left == 'number' && typeof right == 'number') {
		return left - right
	}
	if (typeof left == 'number') left = [left]
	if (typeof right == 'number') right = [right]

	for (let i = 0; i < left.length || i < right.length; i++) {
		if (i >= right.length) return 1
		if (i >= left.length) return -1

		let c = compare(left[i], right[i])
		if (c != 0) return c
	}
	return 0
}

function partA(pairs) {
	let sum = 0
	for (let i=0; i < pairs.length; i++) {
		let [left, right] = pairs[i]
		if (compare(left, right) < 0) {
			sum += i+1
		}
	}
	return sum
}

function partB(lines) {
	lines.push('[[2]]')
	lines.push('[[6]]')
	lines.sort(compare)
	return (lines.indexOf('[[2]]')+1) * (lines.indexOf('[[6]]')+1)
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse2(test)))
console.log(partB(parse2(input)))

