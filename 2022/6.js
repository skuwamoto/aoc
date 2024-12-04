const fs = require('fs');

let test = fs.readFileSync('./test6.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input6.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
	return lines
}

function unique(arr) {
    return [...new Set(arr)];
}

function partA(chars) {
	let buf = []
	for (let i=0; i < chars.length; i++) {
		buf.push(chars[i])
		if (buf.length > 4) buf.shift()
		if (unique(buf).length == 4) return i+1
	}
}

function partB(chars) {
	let buf = []
	for (let i=0; i < chars.length; i++) {
		buf.push(chars[i])
		if (buf.length > 14) buf.shift()
		if (unique(buf).length == 14) return i+1
	}
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

