const fs = require('fs');

let test = fs.readFileSync('./test7.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input7.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
	lines = lines.split('\n')

	let root = {}
	root.parent = root

	let cwd = root

	// Make the directories
	let i=0
	for (let i=0; i<lines.length; i++) {
		let cmd = lines[i]
		if (cmd[0] == '$') {
			if (cmd.substr(0, '$ cd '.length) == '$ cd ') {
				let dir = cmd.substr('$ cd '.length) 
				// console.log('cd to', dir)
				if (dir != '/') {
					cwd = (dir == '..') ? cwd.parent : cwd[dir]
				}
			} else {
				while (i+1 < lines.length && lines[i+1][0] != '$') {
					i++
					let [a, b] = lines[i].split(' ')
					if (a == 'dir') {
						if (!cwd[b]) {
							// console.log('making', b)
							cwd[b] = { parent: cwd }
						}
					} else {
						// console.log('file', b, 'of size', a)
						cwd[b] = { size: Number(a) }
					}
				}
			}
		}
	}

	// Size the directories
	computeSizes(root)

	return root
}

function computeSizes(node) {
	let sum = 0
	for (let k of Object.keys(node)) {
		if (k == 'parent') {
			// do nothing
		} else if (node[k].size) {
			// console.log(k, 'is a file')
			sum += node[k].size
		} else {
			// console.log(k, 'is a directory')
			sum += computeSizes(node[k])
		}
	}
	// console.log('adding size', sum)
	node.size = sum
	return sum
}

function sumSizesLessThan(node, n) {
	let sum = 0
	for (let k of Object.keys(node)) {
		if (k != 'parent') {
			sum += sumSizesLessThan(node[k], n)
		}
	}
	if (node.size && node.parent && node.size <= n) {
		// console.log('adding', node.size)
		sum += node.size
	}
	return sum
}

function gatherSizes(node, result) {
	if (node.parent) {
		result.push(node.size) 
		for (let k of Object.keys(node)) {
			if (k != 'parent' && node[k].parent) {
				gatherSizes(node[k], result)
			}
		}
	}
}

function partA(root) {
	return sumSizesLessThan(root, 100000)
}

function partB(root) {
	let need = 30000000 - (70000000 - root.size)

	let sizes = []
	gatherSizes(root, sizes)
	sizes.sort((a,b) => a-b)

	// console.log('need', need)
	// console.log('sizes', sizes)

	for (let size of sizes) {
		if (size > need) {
			return size
		}
	}
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
// console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

