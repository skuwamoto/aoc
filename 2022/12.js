const fs = require('fs');

let test = fs.readFileSync('./test12.txt', 'utf8');
let input = fs.readFileSync('./input12.txt', 'utf8');

function parse(lines) {
	return lines.split('\n').map(x => x.split('').map(x => x.charCodeAt(0)))
}

function getBest(elev) {
	let queue = []
	let h = elev.length
	let w = elev[0].length
	let endI, endJ

	let best = []
	for (let i=0; i < h; i++) {
		best.push(Array(w).fill(1000000))
	}

	for (let i=0; i < h; i++) {
		for (let j=0; j < w; j++) {
			if (elev[i][j] == 'S'.charCodeAt(0) || elev[i][j] == 'a'.charCodeAt(0)) {
				pos = {i:i, j:j, steps:0}
				elev[i][j] = 'a'.charCodeAt(0)
				queue.push(pos)
			}
			if (elev[i][j] == 'E'.charCodeAt(0)) {
				endI = i
				endJ = j
				elev[i][j] = 'z'.charCodeAt(0)
			}
		}
	}

	while (queue.length) {
		let {i, j, steps} = queue.shift()
		if (best[i][j] > steps) {
			best[i][j] = steps

			let neighbors = [[i-1,j], [i+1,j], [i,j-1], [i,j+1]].filter(x => x[0] >= 0 && x[0] < h && x[1] >= 0 && x[1] < w)

			for (let [ii, jj] of neighbors) {
				if (elev[ii][jj] <= elev[i][j]+1) {
					queue.push({i:ii, j:jj, steps: steps+1})
				}
			}
		}
		queue.sort((a,b) => a.steps - b.steps)
	}

	return best[endI][endJ]
}

console.log(getBest(parse(test)))
console.log(getBest(parse(input)))

