'use strict';
const fs = require('fs');

let testX = [20,30]
let testY = [-10,-5]

let inputX = [241,273]
let inputY = [-97,-63]

function partA(rangeX, rangeY) {
	let bestHigh = 0

	for (let vy_init=0; ; vy_init++) {
		let y = 0;
		let prevY = 0;
		let vy = vy_init
		let high = 0
		let hit = false

		while (y >= rangeY[0]) {
			if (y <= rangeY[1]) {
				hit = true
			}

			prevY = y
			y += vy
			vy -= 1

			high = Math.max(high, y)
		}

		if (hit && high > bestHigh) {
			bestHigh = high
		}

		if (prevY >= 0) break
	}

	return bestHigh
}

function partB(rangeX, rangeY) {
	let count = 0;

	for (let vx_init=0; vx_init < rangeX[1]+1; vx_init++) {
		for (let vy_init=rangeY[0]-1; vy_init < -rangeY[0]+1; vy_init++) {
			let x = 0;
			let y = 0;
			let vx = vx_init
			let vy = vy_init
			let hit = false

			while (y >= rangeY[0]) {
				if (x >= rangeX[0] && x <= rangeX[1] && y <= rangeY[1]) {
					hit = true
				}

				x += vx
				y += vy
				vy -= 1
				if (vx > 0) vx--
			}

			if (hit) {
				count++
			}
		}
	}	

	return count
}

console.log(partA(testX, testY))
console.log(partA(inputX, inputY))
console.log('--')
console.log(partB(testX, testY))
console.log(partB(inputX, inputY))
