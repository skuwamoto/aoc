const fs = require('fs');

let test = fs.readFileSync('./test19.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input19.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
	return lines.split('\n').map(x => {
		let nums = x.split(/[^\d]+/).map(Number)
		return {
			id: nums[1], 
			rules: { 
				geode: {ore: nums[6], obsidian: nums[7]}, 
				obsidian: {ore: nums[4], clay: nums[5]}, 
				clay: {ore: nums[3]}, 
				ore: {ore: nums[2]}, 
				noop: {}
			}
		}
	})
}

function countGeodes(rules) {
	let robots = { ore: 1, clay: 0, obsidian: 0,  geode: 0 }
	let stuff = { ore: 0, clay: 0, obsidian: 0, geode: 0 }
	let time = 0

	return getBest(rules, robots, stuff, time, {})
}

function getBest(rules, robots, stuff, time, cache) {
	if (time == 24) return stuff.geode

	// console.log('minute', time)
	// console.log('robots', JSON.stringify(robots))
	// console.log('stuff', JSON.stringify(stuff)) 
	// console.log('-------------------------')

	let key = JSON.stringify(robots) + JSON.stringify(stuff) + time
	if (!cache[key]) {
		let best = 0

		for (let [robotToMake, recipe] of Object.entries(rules.rules)) {
			let valid = true
			let newStuff = Object.assign({}, stuff)
			let newRobots = Object.assign({}, robots)

			for (let [ingredient, amount] of Object.entries(recipe)) {
				newStuff[ingredient] -= amount
				if (newStuff[ingredient] < 0) valid = false
			}

			if (valid) {
				// console.log('making', robotToMake)
				for (let [robotType, amount] of Object.entries(robots)) {
					newStuff[robotType] += amount
				}
				if (robotToMake != 'noop') {
					newRobots[robotToMake]++
				}
				best = Math.max(best, getBest(rules, newRobots, newStuff, time+1, cache))

				if (robotToMake == 'obsidian' || robotToMake == 'geode') break
			} 
		}
		cache[key] = best
	}
	return cache[key]
}

function partA(lines) {
	let sum = 0
	for (let l of lines) {
		let count = countGeodes(l) 
		console.log(count)
		sum += count * l.id
	}
	return sum
}

function partB(lines) {
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

