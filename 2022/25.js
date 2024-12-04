const fs = require('fs');

let test = fs.readFileSync('./test25.txt', 'utf8');
let input = fs.readFileSync('./input25.txt', 'utf8');

function parse(lines) {
	return lines.split('\n')
}

let table = [[2, "2"], [1, "1"], [0, "0"], [-1, "-"], [-2, "="]]

function snafu2dec(str) {
	let sum = 0
	for (let i=0; i < str.length; i++) {
		sum *= 5
		sum += table.find(x => x[1] == str[i])[0]
	}
	return sum
}

function dec2snafu(num) {
	let p = 1
	while (Math.round(num / p) > 0) {
		p *= 5
	}
	p /= 5

	let str = ''
	while (p >= 1) {
		let digit = Math.round(num / p)
		str += table.find(x => x[0] == digit)[1]
		num -= digit * p
		p /= 5
	}
	return str
}

function partA(lines) {
	let sum = 0
	for (let l of lines) {
		sum += snafu2dec(l)
	}
	return dec2snafu(sum)
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))

