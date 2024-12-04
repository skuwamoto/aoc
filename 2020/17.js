const fs = require('fs');

var text = fs.readFileSync('./17.txt', 'utf8')
var lines = text.trim().split('\n').map(x => x.split(''))

var shortText = fs.readFileSync('./17short.txt', 'utf8')
var shortLines = shortText.trim().split('\n').map(x => x.split(''))

function count(a, z, i, j, zz, h, w) {
	let c = 0
	// console.log('checking', z, i, j)
	for (let zi = z-1; zi < z+2; zi++) {
		for (let ii = i-1; ii < i+2; ii++) {
			for (let ji = j-1; ji < j+2; ji++) {
				if (zi >= 0 && zi < zz && ii >= 0 && ii < h && ji >=0 && ji < w && !(zi==z && ii==i && ji == j) ) {
					if (a[zi][ii][ji] == '#') {
						// debugger
						// console.log('   found at', zi, ii, ji)
						c++
					}
				}
			}
		}
	}

	return c
}


function count4(a, z, q, i, j, zz, qq, h, w) {
	let c = 0
	// console.log('checking', z, i, j)
	for (let zi = z-1; zi < z+2; zi++) {
		for (let qi = q-1; qi < q+2; qi++) {
			for (let ii = i-1; ii < i+2; ii++) {
				for (let ji = j-1; ji < j+2; ji++) {
					if (zi >= 0 && zi < zz && qi >= 0 && qi < qq && ii >= 0 && ii < h && ji >=0 && ji < w && !(zi==z && ii==i && ji == j && qi==q) ) {
						if (a[zi][qi][ii][ji] == '#') {
							// console.log('   found at', zi, ii, ji)
							c++
						}
					}
				}
			}
		}
	}
	return c
}


function part1(lines) {
	let h = lines.length
	let w = lines[0].length
	let pad = 6

	let cur = []
	for (let z=0; z < 1 + pad*2; z++) {
		cur.push([])
		for (let i=0; i < h + pad*2; i++) {
			cur[z].push([])
			for (let j=0; j < w + pad*2; j++) {
				if (z != pad || i-pad < 0 || i-pad >= h || j-pad < 0 || j-pad >= w) {
					cur[z][i][j] = '.'
				} else {
					cur[z][i][j] = lines[i-pad][j-pad]
				}
			}
		}
	}
	// console.log(cur)
	// console.log('--')

	let nTimes = 6
	for (let n=0; n < nTimes; n++) {
		let next = []

		let zz = cur.length
		let h = cur[0].length
		let w = cur[0][0].length

		for (let z=0; z < zz; z++) {
			next.push([])
			for (let i=0; i < h; i++) {
				next[z].push([])
				for (let j=0; j < w; j++) {
					let c = count(cur, z, i, j, zz, h, w)
					if (cur[z][i][j] == '#') {
						next[z][i][j] = (c == 2 || c == 3) ? '#' : '.'
					} else {
						next[z][i][j] = (c == 3) ? '#' : '.'
					}
					if (next[z][i][j] == '#') {
						// console.log('    bingo!')
						// console.log(cur)
						// console.log('******')
						// console.log(next)
						// console.log(z, i, j)
						// let x = foo()
					}
				}
			}
		}
		cur = next
	// console.log(cur)
	// console.log('--')
	}


	let sum = 0
	for (let z=0; z < cur.length; z++) {
		for (let i=0; i < cur[z].length; i++) {
			for (let j=0; j < cur[z][i].length; j++) {
				if (cur[z][i][j] == '#') sum++
			}
		}
	}
	return sum
}

function part2(lines) {
	let h = lines.length
	let w = lines[0].length
	let pad = 6

	let cur = []
	for (let z=0; z < 1 + pad*2; z++) {
		cur.push([])

		for (let q=0; q < 1 + pad*2; q++) {
			cur[z].push([])
		
			for (let i=0; i < h + pad*2; i++) {
				cur[z][q].push([])
				for (let j=0; j < w + pad*2; j++) {
					if (z != pad || q != pad || i-pad < 0 || i-pad >= h || j-pad < 0 || j-pad >= w) {
						cur[z][q][i][j] = '.'
					} else {
						cur[z][q][i][j] = lines[i-pad][j-pad]
					}
				}
			}
		}		
	}
	// console.log(cur)
	// console.log('--')

	let nTimes = 6
	for (let n=0; n < nTimes; n++) {
		let next = []

		let zz = cur.length
		let qq = cur[0].length
		let h = cur[0][0].length
		let w = cur[0][0][0].length

		for (let z=0; z < zz; z++) {
			next.push([])
			for (let q=0; q < qq; q++) {
				next[z].push([])
				for (let i=0; i < h; i++) {
					next[z][q].push([])
					for (let j=0; j < w; j++) {
						let c = count4(cur, z, q, i, j, zz, qq, h, w)
						if (cur[z][q][i][j] == '#') {
							next[z][q][i][j] = (c == 2 || c == 3) ? '#' : '.'
						} else {
							next[z][q][i][j] = (c == 3) ? '#' : '.'
						}
						if (next[z][q][i][j] == '#') {
							// console.log('    bingo!')
							// console.log(cur)
							// console.log('******')
							// console.log(next)
							// console.log(z, i, j)
							// let x = foo()
						}
					}
				}
			}
		}
		cur = next
	// console.log(cur)
	// console.log('--')
	}

	let sum = 0
	for (let z=0; z < cur.length; z++) {
		for (let q=0; q < cur[z].length; q++) {
			for (let i=0; i < cur[z][q].length; i++) {
				for (let j=0; j < cur[z][q][i].length; j++) {
					if (cur[z][q][i][j] == '#') sum++
				}
			}
		}
	}
	return sum
}

console.log('-----------------------------------------------------------------')
console.log('Part 1')
console.log(part1(shortLines))
console.log(part1(lines))
console.log('--')
console.log('Part 2')
console.log(part2(shortLines))
console.log(part2(lines))
console.log('-----------------------------------------------------------------')
