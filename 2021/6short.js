const fs = require('fs');

let test = fs.readFileSync('./test6.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input6.txt', {encoding:'utf8', flag:'r'});

test = test.split(',').map(Number)
input = input.split(',').map(Number)

function countFish(counts, n) {
	let map = [0,0,0,0,0,0,0,0]
	counts.forEach(x => map[x]++)

	for (let i=0; i < n; i++) {
		map.push(map.shift())
		map[6] += map[8]
	}

	return map.reduce((prev, cur) => prev+cur)
}

console.log(countFish(test, 80))
console.log(countFish(input, 80))
console.log('--')
console.log(countFish(test, 256))
console.log(countFish(input, 256))
