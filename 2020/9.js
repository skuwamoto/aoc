const fs = require('fs');

var text = fs.readFileSync('./9.txt', 'utf8')
var lines = text.split('\n').map(x => parseInt(x, 10))

function part1(lines) {
	let used = []

	for (i = 25; i < lines.length; i++)  {
		let found = false
		for (j = i-25; j < i; j++) {
			for (k = i-25; k < i; k++) {
				if (lines[j] != lines[k] && lines[j] + lines[k] == lines[i]) {
					found = true
					break;
				}
				if (found)
					break;
			}
		}
		if (!found) return lines[i]
	}
	return null
}

function part2(lines, target) {
	for (i=0; i < lines.length; i++) {
		let sum = lines[i];
		let min = sum
		let max = sum
		for (j=i+1; j < lines.length; j++) {
			sum += lines[j]
			if (lines[j] < min) min = lines[j]
			if (lines[j] > max) max = lines[j]
			if (sum == target) {
				return min + max
			}
		}
	}
	return null
}

let target = part1(lines)
console.log(part2(lines, target))
