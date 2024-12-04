const fs = require('fs');

let test = fs.readFileSync('./test8.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input8.txt', {encoding:'utf8', flag:'r'});

test = test.split('\n').map(x => x.split(' | ').map(x => x.split(' ')))
input = input.split('\n').map(x => x.split(' | ').map(x => x.split(' ')))

function partA(lines) {
	let count = 0

	for (line of lines) {
		let [examples, output] = line
		for (pattern of output) {
			if (pattern.length == 2 || // 1
				pattern.length == 3 || // 7
				pattern.length == 4 || // 4
				pattern.length == 7    // 8
			) {
				count++
			}
		}
	}
	return count
}

function getPermutations(chars) {
	if (chars.length == 1) {
		return [chars]
	}

	let result = []
	for (let i=0; i < chars.length; i++) {
		let c = chars[i]
		let rest = getPermutations(chars.slice(0, i) + chars.slice(i+1))
		rest.forEach(r => result.push(c + r))
	}

	return result
}

function permute(str, perm) {
	let result = []
	for (let i = 0; i < str.length; i++) {
		result.push( perm[str[i].charCodeAt(0) - 'a'.charCodeAt(0)] )
	}
	result.sort()
	return result.join('')
}

console.log(permute('abc', 'bcgafde'))

function partB(lines) {
	let count = 0

	// correct wiring
	let nums = {
		'abcefg': 0, 
		'cf': 1, 
		'acdeg': 2, 
		'acdfg': 3, 
		'bcdf': 4, 
		'abdfg': 5, 
		'abdefg': 6, 
		'acf': 7, 
		'abcdefg': 8, 
		'abcdfg': 9
	}

	let permutations = getPermutations('abcdefg')

	for (let [examples, output] of lines) {
		let foundPerm = ''

		for (let p of permutations) {
			let bad = false
			for (let e of examples) {
				let permuted = permute(e, p)
				if (!nums.hasOwnProperty(permuted)) {
					bad = true
					break
				}
			}
			if (!bad) {
				foundPerm = p
				break
			}
		}

		let thisNum = 0
		for (let o of output) {
			thisNum *= 10
			thisNum += nums[permute(o, foundPerm)]
		}
		count += thisNum
	}
	return count
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
