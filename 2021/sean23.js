'use strict';
const fs = require('fs');

let testText = fs.readFileSync('./test23.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./inputSean23.txt', {encoding:'utf8', flag:'r'});
let goalText = fs.readFileSync('./goal23.txt', {encoding:'utf8', flag:'r'});

let nodes = [
	"HW,0", "HW,1", "HW,2", "HW,3", "HW,4", "HW,5", "HW,6",
	"sA,0", "sA,1",
	"sB,0", "sB,1",
	"sC,0", "sC,1",
	"sD,0", "sD,1"
	]
// A hashmap of different game board positions and their scores.
let lowestScores = {};
function process(file) {
	let arrFile = file.split('\n').map(x => x.split(''));

	return {
		"sA": [arrFile[2][3], arrFile[3][3]],
		"sB": [arrFile[2][5], arrFile[3][5]],
		"sC": [arrFile[2][7], arrFile[3][7]],
		"sD": [arrFile[2][9], arrFile[3][9]],
		"HW": [".", ".", ".", ".", ".", ".", "."],
		"totalScore": 0,
		"movesSoFar": 0
	}
}

let lowestScore = 999999999;
function distance(slotIndex, slotType, h) {
	let distance = 0;

	// Must travel 1 further in order to get somwhere from window.
	if (slotType == "window") distance++;

	if (h <= 1) {
		if (h == 0) distance++;

		// If at pos 0, it takes 2 steps to get to hallway 1, pos 1, 4, pos 2, 6, etc.
		distance += (slotIndex + 1) * 2;
	}
	else if (h == 2)  {
		if (slotIndex == 0) distance += 2;
		else if (slotIndex == 1) distance += 2;
		else if (slotIndex == 2) distance += 4;
		else if (slotIndex == 3) distance += 6;
	}
	else if (h == 3) {
		if (slotIndex == 0) distance += 4;
		else if (slotIndex == 1) distance += 2;
		else if (slotIndex == 2) distance += 2;
		else if (slotIndex == 3) distance += 4;
	}
	else if (h == 4) {
		if (slotIndex == 0) distance += 6;
		else if (slotIndex == 1) distance += 4;
		else if (slotIndex == 2) distance += 2;
		else if (slotIndex == 3) distance += 2;
	}
	else if (h >= 5) {
		if (h == 6) distance++;

		// If at pos 0, it takes 2 steps to get to hallway 1, pos 1, 4, pos 2, 6, etc.
		distance += (4 - slotIndex) * 2;
	}

	return distance;
}

function makeDebugGameState(gameState, node1, cc) {
	let debugGameState = {
		"sA": gameState["sA"].concat(),
		"sB": gameState["sB"].concat(),
		"sC": gameState["sC"].concat(),
		"sD": gameState["sD"].concat(),
		"HW": gameState["HW"].concat(),
		"totalScore": 0,
		"movesSoFar": 0
	}
	if (cc != node1) {
		debugGameState[cc.substring(0, 2)][getPos(cc)] = gameState[node1.substring(0, 2)][getPos(node1)];
		debugGameState[node1.substring(0, 2)][getPos(node1)] = ".";
	}
	return debugGameState
}

function getPos(cc) {
	return Number(cc.substring(3))
}

function move(gameState, node1, node2) {
	let debugging = false
	if (debugging) console.log('moving', node1, '->', node2)
	// Char at node 1.
	const charAt1 = gameState[node1.substring(0, 2)][getPos(node1)];
	// Char at node 2.
	const charAt2 = gameState[node2.substring(0, 2)][getPos(node2)];

	if (debugging) console.log('>>>>')

	// When moving item from A -> B, if A is empty, can't move.
	if (charAt1 == ".") return false;
	// If B isn't empty, can't move.
	if (charAt2 != ".") return false;

	if (debugging) console.log('>>>>')

	// If A is in the hallway AND B isn't the same type as the Char at A, can't continue.
	if (node1.substring(0, 1) == "H" && charAt1 != node2.substring(1, 2)) return false;

	if (debugging) console.log('>>>>')

	// If start and end are in the same tube, can't continue.
	if (node1.substring(2, 1) == node2.substring(2, 1)) return false;

	if (debugging) console.log('>>>>')

	// If a node is in the correct tube and not all the the nodes below it are too, can't move.
	if (getPos(node1) == 0 && charAt1 == node1.substring(1, 2) && charAt1 == gameState[node1.substring(0, 2)][1]) return false;
	if (getPos(node1) == 1 && charAt1 == node1.substring(1, 2)) return false;

	if (debugging) console.log('>>>>')

	// If a node is moving to a tube and it has a space below the space its moving to, and that space is empty, can't move.
	if (node2.substring(0, 1) == "s" && getPos(node2) + 1 > 0 && gameState[node2.substring(0, 2)][getPos(node2) + 1] == ".") return false;

	if (debugging) console.log('>>>>')

	// If a node is moving to a tube and it's moving to a space that's not the bottom and it has incorrect values, can't move.
	if (node2.substring(0, 1) == "s" && getPos(node2) < 1 && gameState[node2.substring(0, 2)][1] != node2.substring(1, 2)) return false;

	if (debugging) console.log('>>>>')

	let moveScore = gameState.totalScore;
	let scoreRate = {"A": 1, "B": 10, "C": 100, "D": 1000}[charAt1];
	// Current coordinates.
	let cc = node1;
	//console.log("Attempting to move from: " + node1 + " to: " + node2);
	while (cc != node2) {
		//printGameState(makeDebugGameState(gameState, node1, cc));
		// If its currently in a tube
		if (cc.substring(0, 1) == "s") {
			// If its not at the top of the tube yet, move it up
			if (getPos(cc) > 0) {
				// If the next pos has stuff in it, path is obstructed. Can't move.
				if (gameState[cc.substring(0, 2)][getPos(cc) - 1] != ".") { /*console.log("0. obstacle in path, returned false");*/ return false;}
				cc = cc.substring(0, 3) + (getPos(cc) - 1);
				moveScore += scoreRate;
			}
			// If its at the top of the tube, move it to the correct hallway positon.
			else {
				// If the target is a tube, find out which way to move.
				if (node2.substring(0, 1) == "s") {
					let tubePos = {"A": 1, "B": 2, "C": 3, "D": 4}[cc.substring(1, 2)];
					let destinationTubePos = {"A": 1, "B": 2, "C": 3, "D": 4}[node2.substring(1, 2)]
					// If the current tube pos is less than the target tube pos, move to tubePos +1 hallway, else move to tubePos halway.
					if (tubePos < destinationTubePos) {
						if (gameState["HW"][tubePos + 1] != ".") return false;
						cc = "HW," + (tubePos + 1);
						moveScore += 2 * scoreRate;
					}
					else if (tubePos > destinationTubePos) {
						if (gameState["HW"][tubePos] != ".") return false;
						cc = "HW," + tubePos;
						moveScore += 2 * scoreRate;
					}
					else {
						if (gameState[cc.substring(0, 2)][getPos(cc) + 1] != ".") { console.log('found a bug'); return false; }
						cc = cc.substring(0, 3) + (getPos(cc) + 1);
						moveScore += scoreRate;
					}
				}
				// If the target is a hallway, find out which way to move.
				else {
					let tubePos = {"A": 1, "B": 2, "C": 3, "D": 4}[cc.substring(1, 2)];
					// If the current tube pos is less than the target hallway pos, move to tubePos +1 hallway, else move to tubePos halway.
					if (tubePos < getPos(node2)) {
						if (gameState["HW"][tubePos + 1] != ".") return false;
						cc = "HW," + (tubePos + 1);
						moveScore += 2 * scoreRate;
					}
					else {
						if (gameState["HW"][tubePos] != ".") return false;
						cc = "HW," + tubePos;
						moveScore += 2 * scoreRate;
					}
				}
			}
		}
		// If its currently in a hallway.
		else {
			// If target spot is a hallway, move towards it.
			if (node2.substring(0, 1) == "H") {
				
				// If destination pos is greater, move forward, else move backwards.
				if (getPos(node2) > getPos(cc)) {
					if (gameState["HW"][getPos(cc)+ 1] != ".") {/*console.log("1. obstacle in path, returned false");*/ return false;}
					cc = "HW," + (getPos(cc) + 1);
				}
				else {
					if (gameState["HW"][getPos(cc) - 1] != ".") {/*console.log("2. obstacle in path, returned false");*/ return false;}
					cc = "HW," + (getPos(cc) - 1);
				}
				// If it has just moved to one of the ends of the hallway, only count one tile moved. Else count 2.
				if (getPos(cc) == 0 || getPos(cc) == 6) moveScore += scoreRate; 
				else moveScore += 2 * scoreRate;
			}
			// If target spot is a tube.
			else {
				//console.log("BeginState: " + toKey(gameState));
				// console.log("Attempting: " + node1 + " -> " + node2);
				let destinationTubePos = {"A": 1, "B": 2, "C": 3, "D": 4}[node2.substring(1, 2)];
				// If the destination tube is availiable to be moved to, move to it.
				if (getPos(cc) == destinationTubePos || getPos(cc) == destinationTubePos + 1) {
					if (gameState[node2.substring(0, 2)][0] != ".") {/*console.log("Attempting: " + node1 + " -> " + node2 + " and failed.")*/; return false;}
					let debugCC = cc
					cc = node2.substring(0, 3) + "0";
					// console.log("succeded in moving " + debugCC + " into tube " + cc);
					// stateToState(makeDebugGameState(gameState, node1, debugCC), makeDebugGameState(gameState, node1, cc));
				}

				// If you can't move directly into the destination tube yet, move in the hallway towards it.
				else {
					let ccBefore = cc;
					if (destinationTubePos > getPos(cc)) {
						if (gameState["HW"][getPos(cc) + 1] != ".") {/*console.log("4. obstacle in path, returned false");*/ return false;}
						cc = "HW," + (getPos(cc) + 1);
					}
					else {
						if (gameState["HW"][getPos(cc) - 1] != ".") {/*console.log("5. obstacle in path, returned false");*/ return false;}
						cc = "HW," + (getPos(cc) - 1);
					}
					//console.log("succeded in moving across the hallway from: " + ccBefore + " to: " + cc);
				}
				moveScore += 2 * scoreRate;
			}
		}
	}

	
	let returnGameState = {
		"sA": gameState["sA"].concat(),
		"sB": gameState["sB"].concat(),
		"sC": gameState["sC"].concat(),
		"sD": gameState["sD"].concat(),
		"HW": gameState["HW"].concat(),
		"totalScore": moveScore,
		"movesSoFar": gameState.movesSoFar + 1
	}
	returnGameState[node2.substring(0, 2)][getPos(node2)] = charAt1;
	returnGameState[node1.substring(0, 2)][getPos(node1)] = ".";
	// stateToState(gameState, returnGameState);
	// console.log("Finished! Got from: " + node1 + " to: " + cc + "and score went from: " + gameState.totalScore + " to: " + returnGameState.totalScore + "\n");

	return returnGameState;
}

function toKey(gameState) {
	return "" + gameState.HW.join('') + gameState.sA.join('') + gameState.sB.join('') + gameState.sC.join('') + gameState.sD.join('');
}

function printGameState(gameState) {
	console.log("#############");
	console.log("#" + gameState.HW[0] + gameState.HW[1] + "." + gameState.HW[2] + "." + gameState.HW[3] + "." + gameState.HW[4] + "." + gameState.HW[5] + gameState.HW[6] + "#");
	console.log("###" + gameState.sA[0] + "#" + gameState.sB[0] + "#" + gameState.sC[0] + "#" + gameState.sD[0] + "###");
	console.log("  #" + gameState.sA[1] + "#" + gameState.sB[1] + "#" + gameState.sC[1] + "#" + gameState.sD[1] + "#  ");
	console.log("  #########  \n");
}

function stateToState(gameState1, gameState2) {
	console.log("#############    #############");
	console.log("#" + gameState1.HW[0] + gameState1.HW[1] + "." + gameState1.HW[2] + "." + gameState1.HW[3] + "." + gameState1.HW[4] + "." + gameState1.HW[5] + gameState1.HW[6] + "#" + "    " + "#" + gameState2.HW[0] + gameState2.HW[1] + "." + gameState2.HW[2] + "." + gameState2.HW[3] + "." + gameState2.HW[4] + "." + gameState2.HW[5] + gameState2.HW[6] + "#");
	console.log("###" + gameState1.sA[0] + "#" + gameState1.sB[0] + "#" + gameState1.sC[0] + "#" + gameState1.sD[0] + "###" + " -> " + "###" + gameState2.sA[0] + "#" + gameState2.sB[0] + "#" + gameState2.sC[0] + "#" + gameState2.sD[0] + "###");
	console.log("  #" + gameState1.sA[1] + "#" + gameState1.sB[1] + "#" + gameState1.sC[1] + "#" + gameState1.sD[1] + "#  " + "    " + "  #" + gameState2.sA[1] + "#" + gameState2.sB[1] + "#" + gameState2.sC[1] + "#" + gameState2.sD[1] + "#  ");
	console.log("  #########        #########  ");
}
function split(gameState) {
	let newObjects = [];
	
	for (let i of nodes) {
		for (let j of nodes) {
			if (i.substring(1, 0) == "s" && j.substring(1, 0) == "s") continue;
			if (i.substring(1, 0) == "H" && j.substring(1, 0) == "H") continue;
			// Move returns [gameState, score];
			let tryMove = move(gameState, i, j);
			if (!tryMove) continue;
			if (!lowestScores[toKey(tryMove)]) { 
				lowestScores[toKey(tryMove)] = tryMove.totalScore;
				newObjects.push(tryMove); 
			}
			else if (tryMove.totalScore < lowestScores[toKey(tryMove)]) {
				lowestScores[toKey(tryMove)] = tryMove.totalScore;
				newObjects.push(tryMove); 
			}	
		}
	}

	return newObjects;
	
}
function run(text) {
	let gameObjects = [process(text)];

	// First loop
	let temp = gameObjects.shift();
	let newObjects = split(temp);
	gameObjects.unshift(...newObjects);

	let number = 0;
	while(gameObjects.length >= 1) {
		temp = gameObjects.shift();
		newObjects = split(temp);
		gameObjects.unshift(...newObjects);
		number++;
		//if (number % 1000 == 0) console.log("Numstates: " + gameObjects.length + " best score: " + lowestScores[toKey(process(goalText))] + " num boards seen: " + Object.keys(lowestScores).length + "example moves so far: " + gameObjects[0].movesSoFar);
	}


	console.log(lowestScores[toKey(process(goalText))]);
	console.log(lowestScores[toKey(process(goalText))]);
}

run(testText);