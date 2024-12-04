const fs = require('fs');

let test = fs.readFileSync('./test15.txt', 'utf8');
let input = fs.readFileSync('./input15.txt', 'utf8');

function parse(lines) {
	return lines.split('\n').map((x) => {
		let m = x.match('Sensor at x=(.*), y=(.*): closest beacon is at x=(.*), y=(.*)').map(Number)
		return [[m[1], m[2]], [m[3], m[4]]]
	})
}

function manhattan(p1, p2) {
	return Math.abs(p1[0]-p2[0]) + Math.abs(p1[1]-p2[1])
}

function getIntervalsAt(lines, y) {
	let intervals = []
	for (let [s, b] of lines) {
		let dist = manhattan(s, b)
		let delta = dist - Math.abs(s[1]-y)
		if (delta > 0) {
			intervals.push([s[0]-delta, s[0]+delta])
		}
	}
	return intervals
}

function partA(lines, target) {
	let intervals = getIntervalsAt(lines, target)

	let min = intervals[0][0]
	let max = intervals[0][1]

	for (let v of intervals) {
		min = Math.min(min, v[0])
		max = Math.max(max, v[1])
	}

	let count = 0
	let out = ''
	for (let i=min; i<=max; i++) {
		let occupied = false

		for (let [s, b] of lines) {
			if (s[0] == i && s[1] == target) occupied = true
			if (b[0] == i && b[1] == target) occupied = true 
		}

		if (!occupied) {
			let inInterval = false
			for (let v of intervals) {
				if (v[0] <= i && i <= v[1]) {
					inInterval = true
				}
			}

			if (inInterval) {
				count++
			} 
		}
	}
	// console.log(out)

	return count
}

function partB(lines, range) {
	for (let y=0; y < range; y++) {
		let intervals = getIntervalsAt(lines, y)
		for (let [s, b] of lines) {
			if (b[1] == y) {
				intervals.push([b[0], b[0]])
			}
		}
		intervals.sort((a,b) => a[0]-b[0])

		let m = []
		for (v of intervals) {
			if (v[1] < 0) continue
			if (v[0] < 0) v[0] = 0
			if (m.length == 0) m = v
			if (v[0] == m[1]+2) {
				console.log('found at', v[0]-1, y)
				return (v[0]-1) * 4000000 + y
			} else if (v[1] > m[1]) {
				m[1] = v[1]
			}
			if (m[1] > range) {
				break
			}
		}
	}
}

console.log(partA(parse(test), 10))
console.log(partA(parse(input), 2000000))
console.log('--')
console.log(partB(parse(test), 20))
console.log(partB(parse(input), 4000000))

