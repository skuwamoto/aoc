const fs = require('fs');

var text = fs.readFileSync('./10.txt', 'utf8')
var lines = text.split('\n').map(x => parseInt(x, 10))
lines.sort(function(a, b){return a-b})

function part1(lines) {
	var prev = 0
	var num1 = 0
	var num3 = 0
	for (let i=0; i < lines.length; i++) {
		if (lines[i] - prev == 1) {
			num1++
		} else if (lines[i] - prev == 3) {
			num3++
		}
		prev = lines[i]
	}
	return (num3+1) * num1
}

function part2(lines) {
	lines.push(lines[lines.length-1] + 3)
	return tryOne(lines, 0, 0)
}

let cache = {}
function tryOne(lines, v, index) {
	if (index == lines.length-1) return 1
	if (!cache['' + v + ':' + index]) {
		let result = 0
		for (let i=index; i < index+3 && i < lines.length; i++) {
			if (lines[i]-v > 3) 
				break
			result += tryOne(lines, lines[i], i+1)
		}
		cache['' + v + ':' + index] = result
	}
	return cache['' + v + ':' + index]
}

console.log(part1(lines))
console.log(part2(lines))
