const fs = require('fs');

var text = fs.readFileSync('./8.txt', 'utf8')
var lines = text.split('\n')
var chunks = text.split('\n\n')

function part1(lines) {
	let used = {}
	var ip = 0
	var acc = 0
	while (true) {
		console.log('ip', ip, lines[ip])
		if (used[ip]) return acc
		used[ip] = true
		let [op, val] = lines[ip].split(' ')
		val = parseInt(val, 10)
		if (op == 'jmp') {
			ip += val
		} else if (op == 'acc') {
			acc += val
			ip++
		} else {
			ip++
		}
	}
}

function tryonce(lines) {
	let used = {}
	var ip = 0
	var acc = 0
	while (true) {
		if (ip == lines.length) return acc
		if (used[ip]) return null
		used[ip] = true

		let [op, val] = lines[ip].split(' ')
		val = parseInt(val, 10)
		
		if (op == 'jmp') {
			ip += val
		} else if (op == 'acc') {
			acc += val
			ip++
		} else {
			ip++
		}
	}
}

function part2(lines) {
	for (var i = 0; i < lines.length; i++) {
		let [op, val] = lines[i].split(' ')
		if (op == 'jmp') {
			lines[i] = 'nop ' + val
			result = tryonce(lines)
			if (result != null) return result
			lines[i] = 'jmp ' + val
		} else if (op == 'nop') {
			lines[i] = 'jmp ' + val
			result = tryonce(lines)
			if (result != null) return result
			lines[i] = 'nop ' + val
		}
	}

	return null
}

console.log(part1(lines))
console.log(part2(lines))
