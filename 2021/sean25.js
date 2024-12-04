'use strict';
const fs = require('fs');
const inputText = process(fs.readFileSync('./input25Sean.txt', {encoding:'utf8', flag:'r'}));
const testText = process(fs.readFileSync('./input25test.txt', {encoding:'utf8', flag:'r'}));

function process(file) {	
	return file.split('\n').map(x => x.split(''));
}


function step(grid) {
	let movesHappened = false;

	let newGrid = grid.map(x => x.concat());
	
	// Loops through the east facing sea cucumbers
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			
			let nextCell;
			if (j + 1 == grid[i].length) nextCell = 0;
			else nextCell = j + 1

			if (grid[i][j] == ">" && grid[i][nextCell] == ".") {
				newGrid[i][j] = ".";
				newGrid[i][nextCell] = ">";
				movesHappened = true;
			}
		}
	}
	grid = newGrid.map(x => x.concat());
	// Loops through the south facing sea cucumbers.
	for (let i = 0; i < grid[0].length; i++) {
		for (let j = 0; j < grid.length; j++) {
			
			let nextCell;
			if (j + 1 == grid.length) nextCell = 0;
			else nextCell = j + 1

			if (grid[j][i] == "v" && grid[nextCell][i] == ".") {
				newGrid[j][i] = ".";
				newGrid[nextCell][i] = "v";
				movesHappened = true;
			}
		}
	}
	grid = newGrid.map(x => x.concat());
	if (!movesHappened) {
		grid = false;
	}
	return grid;
}

function printGrid(grid) {
	for (let line of grid) {
		console.log(line.join(''));
	}
	console.log();
}
function run(text) {
	let grid = text;
	let count = 0;
	while (grid) {
		grid = step(grid);
		count++;

	}
	console.log(count);
}
run(testText);
run(inputText);