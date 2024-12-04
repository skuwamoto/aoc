const fs = require('fs');

let test = fs.readFileSync('./test5.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input5.txt', {encoding:'utf8', flag:'r'});

test = test.split('\n').map(x => x.split(' -> ').map(x => x.split(',').map(Number)))
input = input.split('\n').map(x => x.split(' -> ').map(x => x.split(',').map(Number)))

function min(a, b) { return a < b ? a : b }
function max(a, b) { return a > b ? a : b }

function sgn(a, b) { 
	if (a > b) return 1
	if (a < b) return -1
	return 0
}

function add(map, x, y) {
	key = x + ':' + y
	if (!map[key]) map[key] = 0
	map[key]++
}

function count(map) {
    let result = 0
    for (key in map) {
    	if (map[key] >= 2) result++
    }
	return result
}

function partA(lines) {
    let map = {}
    for (line of lines) {
    	let [[ax, ay], [bx, by]] = line

    	if (ax == bx) {
    		for (y = min(ay, by); y <= max(ay, by); y++) {
    			add(map, ax, y)
    		}
    	} else if (ay == by) {
    		for (x = min(ax, bx); x <= max(ax, bx); x++) {
    			add(map, x, ay)
    		}
    	}
    }

    return count(map)
}

function partB(lines) {
    let map = {}
    for (line of lines) {
    	let [[ax, ay], [bx, by]] = line

    	if (ax == bx) {
    		for (y = min(ay, by); y <= max(ay, by); y++) {
    			add(map, ax, y)
    		}
    	} else if (ay == by) {
    		for (x = min(ax, bx); x <= max(ax, bx); x++) {
    			add(map, x, ay)
    		}
    	} else if ((ax<bx && ay<by) || (ax>bx && ay>by)) {
    		for (x = min(ax, bx), y = min(ay, by); x <= max(ax, bx); x++, y++) {
    			add(map, x, y)
    		}
    	} else {
    		for (x = min(ax, bx), y = max(ay, by); x <= max(ax, bx); x++, y--) {
    			add(map, x, y)
    		}
    	}
    }

    return count(map)
}

function partBfast(lines) {
    let map = {}
    for (line of lines) {
    	let [[ax, ay], [bx, by]] = line

    	if (ax == bx) {
    		for (y = min(ay, by); y <= max(ay, by); y++) {
    			add(map, ax, y)
    		}
    	} else if (ay == by) {
    		for (x = min(ax, bx); x <= max(ax, bx); x++) {
    			add(map, x, ay)
    		}
    	} else if ((ax<bx && ay<by) || (ax>bx && ay>by)) {
    		for (x = min(ax, bx), y = min(ay, by); x <= max(ax, bx); x++, y++) {
    			add(map, x, y)
    		}
    	} else {
    		for (x = min(ax, bx), y = max(ay, by); x <= max(ax, bx); x++, y--) {
    			add(map, x, y)
    		}
    	}
    }

    return count(map)
}



console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
