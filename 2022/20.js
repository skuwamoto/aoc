const fs = require('fs');

let test = fs.readFileSync('./test20.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input20.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
	// Make an array of pairs of [index, num]
	let count = 0
	return lines.split('\n').map(x => [count++, Number(x)])
}

// Mix the whole array and return the new array
function mix(lines) {
	let len = lines.length

	for (let i=0; i < len; i++) {
		let j = lines.findIndex(x => x[0] == i)
		let elem = lines[j]

		// Remove from index, and re-add to (index+num) % (len-1)
		let jj = (j + elem[1]) % (len-1)
		lines = lines.slice(0, j).concat(lines.slice(j+1))
		lines = lines.slice(0, jj).concat([elem], lines.slice(jj))
	}
	return lines
}

function partA(lines) {
	// For part A do this once and add the three magic values.
	lines = mix(lines)
	let zero = lines.findIndex(x => x[1] == 0)

	let len = lines.length
	return lines[(zero+1000)%len][1] + lines[(zero+2000)%len][1] + lines[(zero+3000)%len][1] 
}

function partB(lines) {
	// Multiply all values by the magic key
	let key = 811589153
	lines = lines.map(x => [x[0], x[1]*key])

	// Do this 10 times
	for (let i=0; i < 10; i++) {
		lines = mix(lines)
	}

	// Add the three magic values
	let zero = lines.findIndex(x => x[1] == 0)
	let len = lines.length
	return lines[(zero+1000)%len][1] + lines[(zero+2000)%len][1] + lines[(zero+3000)%len][1] 
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

