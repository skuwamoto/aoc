const fs = require('fs');

var fullText = fs.readFileSync('./14.txt', 'utf8')
var fullLines = fullText.trim().split('\n').map(x => x.trim())
var fullNums = fullLines.map(x => parseInt(x, 10))

var shortText = fs.readFileSync('./14short.txt', 'utf8')
var shortLines = shortText.trim().split('\n').map(x => x.trim())
var shortNums = shortLines.map(x => parseInt(x, 10))

function part1(lines) {
	let mem = {}
	let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
	for (line of lines) {
		let [l, r] = line.split(' = ')
		if (l == 'mask') {
			mask = r
		} else {
			let addr = parseInt(l.substring(4, l.length-1), 10)
			let num = parseInt(r, 10).toString(2)
			while (num.length < mask.length) {
				num = '0' + num
			}
			num = num.split('')
			for (let i = 0; i < mask.length; i++) {
				if (mask[i] == '0') num[i] = 0
				if (mask[i] == '1') num[i] = 1
			}
			num = num.join('')
			mem[addr] = parseInt(num, 2)
			console.log('writing', addr, parseInt(num, 2))
		}
	}

	let sum = BigInt(0)
	for (let key in mem) {
		sum += BigInt(mem[key])
	}
	return sum
}

function getAddrs(addr) {
	let result = []
	let queue = [addr]
	while (queue.length) {
		// console.log('queue', queue)
		let a = queue.shift()

		for (let i=0; i < a.length; i++) {
			if (a[i] == 'X') {
				queue.push(a.slice(0, i) + '0' + a.slice(i+1))
				queue.push(a.slice(0, i) + '1' + a.slice(i+1))
				a = null
				break
			}
		}
		if (a) {
			result.push(a)
		}
	}

	return result
}


function part2(lines) {
	let mem = {}
	let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
	for (line of lines) {
		let [l, r] = line.split(' = ')
		if (l == 'mask') {
			mask = r
		} else {
			let addr = parseInt(l.substring(4, l.length-1), 10).toString(2)
			let num = parseInt(r, 10)
			
			while (addr.length < mask.length) {
				addr = '0' + addr
			}
			addr = addr.split('')
			for (let i = 0; i < mask.length; i++) {
				if (mask[i] == '1') addr[i] = '1'
				if (mask[i] == 'X') addr[i] = 'X'
			}
			addr = addr.join('')
			let allAddrs = getAddrs(addr)
			for (let a of allAddrs) {
				mem[a] = num
				// console.log('writing', a, num)
			}
		}
	}

	let sum = BigInt(0)
	for (let key in mem) {
		sum += BigInt(mem[key])
	}
	return sum
}



console.log('-----------------------------------------------------------------')
console.log('Part 1')
// console.log(part1(shortLines))
// console.log(part1(fullLines))
console.log('--')
console.log('Part 2')
console.log(part2(shortLines))
console.log(part2(fullLines))
console.log('-----------------------------------------------------------------')
