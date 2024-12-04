'use strict';
const fs = require('fs');
const inputText = process(fs.readFileSync('./seanInput24.txt', {encoding:'utf8', flag:'r'}));


function process(file) {
	let returnStuff = [];
	const arrFile = file.split('\n').map(x => x.split(' '));
	for (let line of arrFile) {
		const command = line.shift();
		let inputs = line;

		for (let i = 0; i < inputs.length; i++) {
			if (Number(inputs[i]) || Number(inputs[i]) === 0) inputs[i] = Number(inputs[i]);
		}

		returnStuff.push({command: command, inputs: inputs});
	}
	return returnStuff;
}

// Executes the checkSum program on a 14 didget number.
function execute(number) {
	let variables = {w: 0, x: 0, y: 0, z: 0};
	let digits = String(number).split('').map(Number);

	for (let line of inputText) {
		let [a, b] = line.inputs;
		if (typeof b == "string") {
			b = variables[b];
		}
		if (line.command == "inp") variables[a] = digits.shift();
		if (line.command == "add") variables[a] += b;
		if (line.command == "mul") variables[a] *= b;
		if (line.command == "div") {
			if (b == 0) return false;
			variables[a] = Math.trunc(variables[a] /  b);
		}
		if (line.command == "mod") {
			if (variables[a] < 0 || b <= 0) return false;
			variables[a] %= b;
		}
		if (line.command == "eql") variables[a] = 0 + (variables[a] == b);
	}
	return variables.z;
}

function run() {
	let stuff = [[13, 8], [12, 13], [12, 8], [10, 10], [-11, 12], [-13, 1], [15, 13], [10, 5], [-2, 10], [-6, 3], [14, 2], [-0, 2], [-15, 12], [-4, 7]]
	let newNum = [];
	let stack = [];
	let diff;
	for (let i = 0; i < 14; i++) {
		if (stuff[i][0] <= 0) {
			let temp = stack.pop();
			let newDig = newNum[temp[1]] + temp[0] + stuff[i][0]
			if (newDig < 1) {
				diff = 1 - newDig;
				newNum[temp[1]] += diff;
			}
			newNum.push(newDig + diff)
		}
		else {
			newNum.push(1);
			stack.push([stuff[i][1], i])
		}
	}
	newNum = newNum.join('');
	console.log(newNum);
	console.log(execute(newNum))

}
run();