const fs = require('fs');

var fullText = fs.readFileSync('./16.txt', 'utf8')
var fullSections = fullText.trim().split('\n\n')
var fullRules = fullSections[0].split('\n')
var fullMyTix = fullSections[1].split('\n')[1].split(',').map(x => parseInt(x, 10))
var fullNearby = fullSections[2].split('\n')
fullNearby.shift()

var shortText = fs.readFileSync('./16short.txt', 'utf8')
var shortSections = shortText.trim().split('\n\n')
var shortLines = shortText.trim().split('\n')//.map(x => parseInt(x, 10))
var shortRules = shortSections[0].split('\n')
var shortMyTix = shortSections[1].split('\n')[1].split(',').map(x => parseInt(x, 10))
var shortNearby = shortSections[2].split('\n')
shortNearby.shift()

function part1(rules, nearby) {
	let parsed = {}

	for (let r of rules) {
		let [name, first, or, second] = r.split(' ')
		name = name.substring(0, name.length-1)

		let [lo1, hi1] = first.split('-')
		let [lo2, hi2] = second.split('-')
		parsed[name] = {lo1: parseInt(lo1), hi1: parseInt(hi1), lo2: parseInt(lo2), hi2: parseInt(hi2)}
	}

	let sum = 0

	for (let n of nearby) {
		let nums = n.split(',')
		for (let num of nums) {
			let nn = parseInt(num)
			let found = false
			for (let r of Object.values(parsed)) {
				if (nn >= r.lo1 && nn <= r.hi1) found = true
				if (nn >= r.lo2 && nn <= r.hi2) found = true
			}
			if (!found) {
				sum += nn
			}
		}
	}
	return sum
}

function part2(rules, myTix, nearby, prefix) {
	let parsed = {}

	for (let r of rules) {
		let [name, rest] = r.split(': ') 
		let [first, or, second] = rest.split(' ')

		let [lo1, hi1] = first.split('-')
		let [lo2, hi2] = second.split('-')
		parsed[name] = {lo1: parseInt(lo1), hi1: parseInt(hi1), lo2: parseInt(lo2), hi2: parseInt(hi2)}
	}

	let sum = 0

	// throw away bad tickets
	let good = []
	for (let n of nearby) {
		let nums = n.split(',')
		let foundBad = false
		for (let num of nums) {
			let nn = parseInt(num)
			let found = false
			for (let r of Object.values(parsed)) {
				if (nn >= r.lo1 && nn <= r.hi1) found = true
				if (nn >= r.lo2 && nn <= r.hi2) found = true
			}
			if (!found) {
				foundBad = true
			}
		}
		if (!foundBad) {
			good.push(n)
		}
	}

	// process of elimination
	let fieldCount = good[0].split(',').length
	for (key in parsed) {
		let o = []
		for (let i = 0; i < fieldCount; i++) {
			o.push(true)
		}
		parsed[key]['possible'] = o
		parsed[key]['foundPos'] = -1
	}

	for (let n of good) {
		let nums = n.split(',')
		for (let i=0; i < nums.length; i++) {
			let nn = parseInt(nums[i])
			for (let key in parsed) {
				let r = parsed[key]
				if (!((nn >= r.lo1 && nn <= r.hi1) || (nn >= r.lo2 && nn <= r.hi2))) {
					r.possible[i] = false
				} 
			}
		}
	}

	let foundCount = 0
	while (foundCount < fieldCount) {
		let foundAtLeastOne = false
		for (let key in parsed) {
			let r = parsed[key]
			if (r.foundPos == -1) {
				let numPossible = 0
				let possiblePos = -1
				for (let i=0; i < r.possible.length; i++) {
					if (r.possible[i]) {
						numPossible++
						possiblePos = i
					}
				}
				if (numPossible == 1) {
					r.foundPos = possiblePos
					for (let k2 in parsed) {
						parsed[k2].possible[r.foundPos] = false
					}
					foundCount++
					foundAtLeastOne = true
					break;
				}
			}
		}
	}

	let result = 1
	for (let key in parsed) {
		let r = parsed[key]
		if (key.indexOf(prefix) == 0) {
			result *= myTix[r.foundPos]
		}
	}

	return result
}



console.log('-----------------------------------------------------------------')
console.log('Part 1')
console.log(part1(shortRules, shortNearby))
console.log(part1(fullRules, fullNearby))
console.log('--')
console.log('Part 2')
console.log(part2(shortRules, shortMyTix, shortNearby, ''))
console.log(part2(fullRules, fullMyTix, fullNearby, 'departure'))
console.log('-----------------------------------------------------------------')
