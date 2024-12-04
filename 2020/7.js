const fs = require('fs');

var text = fs.readFileSync('./6.txt', 'utf8')
var lines = text.split('\n')
var chunks = text.split('\n\n')

function readRules(lines) {
	let rules = {}
	for (line of lines) {
		let [, subject, object] = line.match(/^([\w\s]+) bags? contain (.+)\./)

		if (object != 'no other bags') {
			let ruleLines = object.split(', ')
			for (ruleLine of ruleLines) {
				let [, num, description] = ruleLine.match(/^(\d+) ([\w\s]+) bag/)

				if (!rules[subject]) {
					rules[subject] = {}
				}
				rules[subject][description] = parseInt(num, 10)
			}
		}
	}
	return rules
}

function hasGoldenBag(rules, root) {
	for (bag in rules[root]) {
		if (bag == 'shiny gold') return true
		if (hasGoldenBag(rules, bag)) return true
	}
	return false
}

function count(counts, rules, bag) {
	if (counts[bag]) return counts[bag]
	let tot = 0
	for (subBag in rules[bag]) {
		tot += rules[bag][subBag]
		tot += rules[bag][subBag] * count(counts, rules, subBag)
	}
	counts[bag] = tot
	return tot
}

function part1() {
	let rules = readRules(lines)
	let found = 0
	for (let bag in rules) {
		if (hasGoldenBag(rules, bag)) {
			found++
		}
	}
	return found
}

function part2() {
	let rules = readRules(lines)
	let counts = {}
	for (let bag in rules) {
		count(counts, rules, bag)
	}
	return counts['shiny gold']
}

console.log(part1(lines))
console.log(part2(lines))
