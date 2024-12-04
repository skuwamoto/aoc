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

function countGeodes(rules, turns) {
	let state = {
		robots:  { ore: 1, clay: 0, obsidian: 0, geode: 0 },
		stuff:  { ore: 0, clay: 0, obsidian: 0, geode: 0 },
		time:  turns
	}
	let queue = [state]

	let seen = new Set()
	seen.add(JSON.stringify(state))

	let best = 0
	let count = 0

	while (queue.length > 0) {
		count++
		if (count % 100 == 0) {
			queue.sort((a,b) => {
				if (a.robots.geode != b.robots.geode) return b.robots.geode - a.robots.geode
				if (a.robots.obsidian != b.robots.obsidian) return b.robots.obsidian - a.robots.obsidian
				if (a.robots.clay != b.robots.clay) return b.robots.clay - a.robots.clay
				if (a.robots.ore != b.robots.ore) return b.robots.ore - a.robots.ore

				if (a.stuff.geode != b.stuff.geode) return b.stuff.geode - a.stuff.geode
				if (a.stuff.obsidian != b.stuff.obsidian) return b.stuff.obsidian - a.stuff.obsidian
				if (a.stuff.clay != b.stuff.clay) return b.stuff.clay - a.stuff.clay
				if (a.stuff.ore != b.stuff.ore) return b.stuff.ore - a.stuff.ore

				return 0
			})

			if (queue.length > 1000) queue.length = 1000
		}

		let {robots, stuff, time} = queue.shift()

		for (let [robotToMake, recipe] of Object.entries(rules.rules)) {
			let valid = true

			for (let [ingredient, amount] of Object.entries(recipe)) {
				if (stuff[ingredient] < amount) {
					valid = false
					break
				}
			}
			if (valid) {
				let newState = {
					robots: Object.assign({}, robots),
					stuff: Object.assign({}, stuff),
					time: time-1
				}

				for (let [ingredient, amount] of Object.entries(recipe)) {
					newState.stuff[ingredient] -= amount
				}
				for (let [robotType, numRobots] of Object.entries(robots)) {
					newState.stuff[robotType] += numRobots
				}
				if (robotToMake != 'noop') {
					newState.robots[robotToMake]++
				}

				best = Math.max(best, newState.stuff.geode)

				if (newState.time > 0) {
					let key = JSON.stringify(newState)
					if (!seen.has(key)) {
						seen.add(key)
						queue.push(newState)
					}
				}
			} 
		}
	}
	return best
}

function partA(lines) {
	let sum = 0
	for (let l of lines) {
		let count = countGeodes(l, 24) 
		sum += count * l.id
	}
	return sum
}

function partB(lines) {
	return countGeodes(lines[0], 32) * countGeodes(lines[1], 32) * countGeodes(lines[2], 32)
}

console.log(partA(parse(test)))
console.log('--')
console.log(partA(parse(input)))
console.log('--')
// console.log(partB(parse(test)))
console.log(partB(parse(input)))

