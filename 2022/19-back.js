const fs = require('fs');

let test = fs.readFileSync('./test19.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input19.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
	return lines.split('\n').map(x => {
		let nums = x.split(/[^\d]+/).map(Number)
		return {id: nums[1], rules: { noop: {}, ore: {ore: nums[2]}, clay: {ore: nums[3]}, obsidian: {ore: nums[4], clay: nums[5]}, geode: {ore: nums[6], obsidian: nums[7]}}}
	})
}

function countGeodes(rules) {
	let queue = [{
		robots: { ore: 1, clay: 0, obsidian: 0,  geode: 0 },
		stuff: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
		time: 19
	}]

	let best = 0
	let count = 0

	while (queue.length) {
		let {robots, stuff, time} = queue.shift()

		if (time == 0) {
			best = Math.max(best, stuff.geode)
		} else {
			for (let [robotToMake, recipe] of Object.entries(rules.rules)) {
				let valid = true
				let newStuff = Object.assign({}, stuff)
				let newRobots = Object.assign({}, robots)

				for (let [ingredient, amount] of Object.entries(recipe)) {
					newStuff[ingredient] -= amount
					if (newStuff[ingredient] < 0) valid = false
				}

				if (valid) {
					for (let [robotType, amount] of Object.entries(robots)) {
						newStuff[robotType] += amount
					}
					if (robotToMake != 'noop') {
						newRobots[robotToMake]++
					}
					queue.push({robots: newRobots, stuff: newStuff, time: time-1})
				}
			}
		}
		count++
		if (count % 100 == 0) {
			// console.log(queue.length)
		}
	}	

	return best
}

function partA(lines) {
	let sum = 0
	for (let l of lines) {
		let count = countGeodes(l) 
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

