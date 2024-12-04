'use strict';
const fs = require('fs');
let testText = fs.readFileSync('./test22.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./input22sean.txt', {encoding:'utf8', flag:'r'});
let smallText = fs.readFileSync('./small22.txt', {encoding:'utf8', flag:'r'});
let bigText = fs.readFileSync('./big22.txt', {encoding:'utf8', flag:'r'});
let input = process(inputText);
let test = process(testText);
let small = process(smallText);
let big = process(bigText);

function runP1(input) {
	// Removes bounds that are outside 50.
	for (let i = 0; i < input.length; i++) {
		// The bounds
		let b = input[i][1];
		if (Math.abs(b[0][0]) > 50 || Math.abs(b[0][1]) > 50 || Math.abs(b[1][0]) > 50 || Math.abs(b[1][1]) > 50 || Math.abs(b[2][0]) > 50 || Math.abs(b[2][1]) > 50) {
			input.splice(i, 1);
			i--;	
		}
	}


	// initalizes the grid.
	let grid = [];
	for (let i = -50; i <= 50; i++) {
		grid.push([]);
		for (let j = -50; j <= 50; j++) {
			grid[i + 50].push([]);
			for (let k = -50; k <= 50; k++) {
				grid[i + 50][j + 50].push(false);
			}
		}
	}

	// performs each command
	for (let command of input) {
		for (let i = command[1][0][0]; i <= command[1][0][1]; i++) {
			for (let j = command[1][1][0]; j <= command[1][1][1]; j++) {
				for (let k = command[1][2][0]; k <= command[1][2][1]; k++) {
					if (command[0] == "on") grid[i + 50][j + 50][k + 50] = true;
					else grid[i + 50][j + 50][k + 50] = false;
				}
			}
		}
	}

	// counts the number of cubes that are on in the end.
	let count = 0;
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			for (let k = 0; k < grid[i][j].length; k++) {
				if (grid[i][j][k]) count++;
			}
		}
	}
	return count;

}

function runP2(input) {

	// Removes bounds that are outside 50.
	// for (let i = 0; i < input.length; i++) {
	// 	// The bounds
	// 	let b = input[i][1];
	// 	if (Math.abs(b[0][0]) > 50 || Math.abs(b[0][1]) > 50 || Math.abs(b[1][0]) > 50 || Math.abs(b[1][1]) > 50 || Math.abs(b[2][0]) > 50 || Math.abs(b[2][1]) > 50) {
	// 		input.splice(i, 1);
	// 		i--;	
	// 	}
	// }

	// initalizes the grid.
	let grid = [];
	let count = 0;
	// The number of cells left on at the end.
	// Loops through each item in the input. If it does not overlap with any ones currently stored in the grid, add it. Else, split it into 7 smaller ones.
	for (let i = 0; i < input.length; i++) {
		grid.push(input[i]);


		// the current bounds of the index.
		let b = input[i][1];
		let miniGrid = [[input[i][1].map(x => x.concat()), false]];
		

		// minGrid = [[[[start, end], [start, end], [start, end]], true], [[[start, end], [start, end], [start, end]], true]]
		for (let j = grid.length - 2; j >= 0; j--) {
			for (let k = 0; k < miniGrid.length; k++) {
			 	let gridBefore = deepCopyArray(miniGrid[k][0]);
				let overlaps = findOverlaps(miniGrid[k][0], grid[j][1]);
				if (overlaps) {
					//console.log(miniGrid[k][0], "overlaps with", grid[j][1], "at", overlaps[0]);
					let newGridStuff = split(miniGrid[k], overlaps[1]);
					miniGrid.splice(k, 1, ...newGridStuff);
					// console.log(gridBefore, overlaps[0], overlaps[1]);
					// console.log("before marking", miniGrid.map(x => JSON.stringify(x)))

					
					k += newGridStuff.length - 1;
					for (let l = 0; l < miniGrid.length; l++) {
						//console.log(miniGrid[l][0])
						if (compareIntervals(miniGrid[l][0], overlaps[0])) {
							//console.log(input[i][0], grid[j][0]);
							if (miniGrid[l][1]) continue;

							if (input[i][0] == "on" && grid[j][0] == "off") {
								count += (miniGrid[l][0][0][1] - miniGrid[l][0][0][0] + 1) * (miniGrid[l][0][1][1] - miniGrid[l][0][1][0] + 1) * (miniGrid[l][0][2][1] - miniGrid[l][0][2][0] + 1);
								//console.log(count);
							}

							if (input[i][0] == "off" && grid[j][0] == "on") {

								count -= (miniGrid[l][0][0][1] - miniGrid[l][0][0][0] + 1) * (miniGrid[l][0][1][1] - miniGrid[l][0][1][0] + 1) * (miniGrid[l][0][2][1] - miniGrid[l][0][2][0] + 1);
								//console.log(count);
							}
							miniGrid[l][1] = true;
						}
					}
				}
			}
			

		}
		//console.log(JSON.stringify(miniGrid[0]));
		// Any cell that has not yet been processed gets added to count.
		for (let j = 0; j < miniGrid.length; j++) {
			if (!miniGrid[j][1] && input[i][0] == "on") {
				count += (miniGrid[j][0][0][1] - miniGrid[j][0][0][0] + 1) * (miniGrid[j][0][1][1] - miniGrid[j][0][1][0] + 1) * (miniGrid[j][0][2][1] - miniGrid[j][0][2][0] + 1);
				//console.log(count)
			}
		}
	}
	return count;
}

function compareIntervals(I1, I2) {
	return (I1[0][0] == I2[0][0] && I1[0][1] == I2[0][1] && I1[1][0] == I2[1][0] && I1[1][1] == I2[1][1] && I1[2][0] == I2[2][0] && I1[2][1] == I2[2][1]);
}

function findOverlaps(interval1, interval2) {
	let returnInterval = [[-1, 1], [-1, 1], [-1, 1]];

	// If the start pos of I1's coords are greater than the end pos of I2's x coords, they cannot overlap.
	if (interval2[0][0] > interval1[0][1] || interval2[0][1] < interval1[0][0]) return false;
	if (interval2[1][0] > interval1[1][1] || interval2[1][1] < interval1[1][0]) return false;
	if (interval2[2][0] > interval1[2][1] || interval2[2][1] < interval1[2][0]) return false;

	for (let i = 0; i < 3; i++) {
		let highestStart = interval1[i][0];
		let lowestEnd = interval1[i][1];

		if (interval2[i][0] > highestStart) highestStart = interval2[i][0];
		if (interval2[i][1] < lowestEnd) lowestEnd = interval2[i][1];

		returnInterval[i] = [highestStart, lowestEnd];
	}	

	// Goes through each corner in I2 and checks if it's inside I1. If so, create divideLocations out of it.
	let divideLocations = [];
	// for (let i = 0; i < 2; i++) {
	// 	for (let j = 0; j < 2; j++) {
	// 		for (let k = 0; k < 2; k++) {
	// 			if (interval2[0][i] >= interval1[0][0] &&
	// 				interval2[0][i] <= interval1[0][1] &&
	// 				interval2[1][j] >= interval1[1][0] &&
	// 				interval2[1][j] <= interval1[1][1] &&
	// 				interval2[2][k] >= interval1[2][0] &&
	// 				interval2[2][k] <= interval1[2][1]
	// 				) {
	// 				if (i == 1) {
	// 					divideLocations.push([0, interval2[0][i]]);
	// 				}
	// 				else {
	// 					divideLocations.push([0, interval2[0][i] - 1]);
	// 				}

	// 				if (j == 1) {
	// 					divideLocations.push([1, interval2[1][j]]);
	// 				}
	// 				else {
	// 					divideLocations.push([1, interval2[1][j] - 1]);
	// 				}
					
	// 				if (k == 1) {
	// 					divideLocations.push([2, interval2[2][k]]);
	// 				}
	// 				else {
	// 					divideLocations.push([2, interval2[2][k] - 1]);
	// 				}
					
	// 			}
	// 		}
	// 	}
	// }
	for (let i = 0; i < 2; i++) {
		if (i == 1) {
			if (interval2[0][i] <= interval1[0][1] && interval2[0][i] >= interval1[0][0]) divideLocations.push([0, interval2[0][i]]);
			if (interval2[1][i] <= interval1[1][1] && interval2[1][i] >= interval1[1][0]) divideLocations.push([1, interval2[1][i]]);
			if (interval2[2][i] <= interval1[2][1] && interval2[2][i] >= interval1[2][0]) divideLocations.push([2, interval2[2][i]]);
		
		}
		else {
			if (interval2[0][i] <= interval1[0][1] && interval2[0][i] >= interval1[0][0]) divideLocations.push([0, interval2[0][i] - 1]);
			if (interval2[1][i] <= interval1[1][1] && interval2[1][i] >= interval1[1][0]) divideLocations.push([1, interval2[1][i] - 1]);
			if (interval2[2][i] <= interval1[2][1] && interval2[2][i] >= interval1[2][0]) divideLocations.push([2, interval2[2][i] - 1]);
		}
	}
	return [returnInterval, divideLocations];
}

function deepCopyArray(a) {
	if (!Array.isArray(a)) return a
	return a.concat().map(deepCopyArray)
}

// Splits an interval into smaller ones.
function split(interval, divideLocations) {
	// Example divide locations: [[0, 1], [1, 5], [1, 10]];
	let newIntervals = [];
	newIntervals.push(interval);
	for (let i = 0; i < divideLocations.length; i++) {
		for (let j = 0; j < newIntervals.length; j++) {
			//Only split on a valid location.
			// [1, 3][1, 9], [4, 6][1, 9], [7, 9][1, 9]
			// [4, 6][1, 9], [7, 9][1, 9], [1, 3][1, 3], [1, 3][4, 6];

			// if (divideLocations[i][0] == 1 && divideLocations[i][1] == 3) {
			// 	console.log(j, newIntervals[j]);
			// }
			if (divideLocations[i][1] >= newIntervals[j][0][divideLocations[i][0]][0] && divideLocations[i][1] < newIntervals[j][0][divideLocations[i][0]][1]) {
				let leftHalf = deepCopyArray(newIntervals[j]);
				let rightHalf = deepCopyArray(newIntervals[j]);

				leftHalf[0][divideLocations[i][0]][1] = divideLocations[i][1];
				rightHalf[0][divideLocations[i][0]][0] = divideLocations[i][1] + 1;

				newIntervals.splice(j, 1);
				newIntervals.unshift(rightHalf);
				newIntervals.unshift(leftHalf);
				j++;
			}			
		}
		// console.log("After command:", divideLocations[i]);
		// console.log(JSON.stringify(newIntervals));
	}
	return newIntervals;

}
function process(inputText) {
	inputText = inputText.split('\n').map(x => x.split(' '));
	inputText = inputText.map(x => [x[0], x[1].split(',').map(x => x.substring(2).split('..').map(Number))]); 
	return inputText;
}	
// console.log(runP1(small));
// console.log(runP1(test));
// console.log(runP1(input));
console.log("--");
console.log("This should be 39:", runP2(small));
let testThing = findOverlaps([[9, 10], [11, 11], [9, 10]], [[10, 12], [10, 12], [10, 12]]);
//console.log(testThing[0], testThing[1]);
console.log("This should be 2758514936282235:", runP2(big));
console.log("THis is what im trying to find!: ", runP2(input));



