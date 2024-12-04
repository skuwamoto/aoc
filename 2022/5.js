const fs = require('fs');

let test = fs.readFileSync('./test5.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input5.txt', {encoding:'utf8', flag:'r'});

function parseInput(lines) {
	let stacks = []
	let inst = []

	lines = lines.split('\n')

	let nCols = (lines[0].length+1) / 4

	for (let i=0; i < nCols; i++) {
		stacks.push([])
	}

	let j=0
	for (; j < lines.length; j++) {
		let l = lines[j]

		// This is the end.
		if (l[1] == '1') break;

		for (let i=0; i < nCols; i++) {
			if (l[i * 4 + 1] != ' ') {
				stacks[i].unshift(l[i * 4 + 1])
			}
		}
	}

	j++
	j++

	for (; j < lines.length; j++) {
		let l = lines[j]

		let match = /move (\d+) from (\d+) to (\d+)/.exec(l)
		inst.push({num: Number(match[1]), from: Number(match[2]), to: Number(match[3])})
	}

	return {stacks, inst}
}

function partA(x) {
	let stacks = x.stacks
	let inst = x.inst

	for (let i of inst) {
		for (let c = 0; c < i.num; c++) {
			let n = stacks[i.from-1].pop()
			stacks[i.to-1].push(n)
		
		}
	}

	let result = ""
	for (let i =0; i < stacks.length; i++) {
		result += stacks[i][stacks[i].length-1]
	}

	return result
}

function partB(x) {
	let stacks = x.stacks
	let inst = x.inst

	for (let i of inst) {
		let temp = []
		for (let c = 0; c < i.num; c++) {
			let n = stacks[i.from-1].pop()
			temp.push(n)
		}

		for (let c=0; c < i.num; c++) {
			stacks[i.to-1].push(temp.pop())
		}
	}

	let result = ""
	for (let i =0; i < stacks.length; i++) {
		result += stacks[i][stacks[i].length-1]
	}

	return result
}

console.log(partA(parseInput(test)))
console.log(partA(parseInput(input)))
console.log('--')
console.log(partB(parseInput(test)))
console.log(partB(parseInput(input)))

