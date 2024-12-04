const fs = require('fs');

let test = fs.readFileSync('./test5.txt', {encoding:'utf8', flag:'r'});

test = test.split('\n')

for (line of test) {
	let [a, b] = line.split(' -> ')
	let [ax, ay] = a.split(',').map(Number)
	let [bx, by] = b.split(',').map(Number)
	let arr = [ax, ay, bx, by]

	arr = arr.filter(x => x != 0)
	arr = arr.map(x => 2 * x)

	console.log(arr)
}


x => x != 0

function nonzero(x) {
	return x != 0
}

function even(x) {
	return x%2 == 0
}
