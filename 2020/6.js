const fs = require('fs');

function part1(input) {
	let map = {}
	let count = 0

	for (var line of input) {
		if (line == "") {
			count += Object.keys(map).length;
			map = {}
		}
		for (var i=0 ; i < line.length; i++) {
			map[line[i]] = 1;
		}
	}
	count += Object.keys(map).length;
	return count
}

function part2(input) {
	let map = {}
	let count = 0
	let first = true

	for (var line of input) {
		if (line == "") {
			count += Object.keys(map).length;
			map = {}
			first = true
		} else {
			if (first) {
				for (var i=0 ; i < line.length; i++) {
					map[line[i]] = 1;
				}
				first = false
			} else {
				for (var key of Object.keys(map)) {
					if (line.indexOf(key) == -1) {
						delete map[key]
					}
				}
			}
		}
	}

	count += Object.keys(map).length;
	return count
}

var lines = fs.readFileSync('./5.txt', 'utf8').split('\n')


console.log(part1(lines))
console.log(part2(lines))
