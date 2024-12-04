const fs = require('fs');

// array to num
//.map(x => parseInt(x))

// reverse array
//.split('').reverse().join('')

// str to array
//.split('') 

var text = fs.readFileSync('./24.txt', 'utf8')
text = text.replace(/se/g,'1')
text = text.replace(/sw/g,'2')
text = text.replace(/nw/g,'4')
text = text.replace(/ne/g,'5')
text = text.replace(/e/g,'0')
text = text.replace(/w/g,'3')
var lines = text.trim().split('\n')

var textShort = fs.readFileSync('./24short.txt', 'utf8')
console.log(textShort)
textShort = textShort.replace(/se/g,'1')
textShort = textShort.replace(/sw/g,'2')
textShort = textShort.replace(/nw/g,'4')
textShort = textShort.replace(/ne/g,'5')
textShort = textShort.replace(/e/g,'0')
textShort = textShort.replace(/w/g,'3')
var linesShort = textShort.trim().split('\n')

function k(x, y) { 
    return [x, y].join(',')
}

function getFlipped(lines) {
    let flipped = {}
    for (let line of lines) {
        let x = 0
        let y = 0
        for (c of line.split('')) {
            switch (c) {
                case '0': x += 1; break;
                case '1': y += 1; break;
                case '2': x -= 1; y += 1; break;
                case '3': x -= 1; break;
                case '4': y -= 1; break;
                case '5': x += 1; y -= 1; break;
            }(x,y)
        }
        flipped[k(x,y)] = !flipped[k(x,y)]
    }
    return flipped
}

function count(flipped) {
    let tot = 0
    for (key in flipped) {
        if (flipped[key]) tot++
    }
    return tot
}

function neighbors(flipped, x, y) {
    let count = 0;
    if (flipped[k(x+1, y)]) count++
    if (flipped[k(x, y+1)]) count++
    if (flipped[k(x-1, y+1)]) count++
    if (flipped[k(x-1, y)]) count++
    if (flipped[k(x, y-1)]) count++
    if (flipped[k(x+1, y-1)]) count++
    return count
}

function part1(lines) {
    return count(getFlipped(lines))
}

function part2(lines, moves) {
    let flipped = getFlipped(lines)
    for (let i=0; i<100; i++) {
        let newFlipped = {}

        for (x = -105; x < +105; x++) {
            for (y = -105; y < +105; y++) {
                if (flipped[k(x, y)]) {
                    if (!(neighbors(flipped, x, y) == 0 || neighbors(flipped, x, y) >2)) newFlipped[k(x,y)] = true
                } else {
                    if (neighbors(flipped, x, y) == 2) newFlipped[k(x, y)] = true
                }
            }
        }
        flipped = newFlipped
    }
    return count(flipped)
}

console.log('-----------------------------------------------------------------')
// console.log('Part 1')
// console.log(part1(linesShort))
// console.log(part1(lines))
// console.log('--')
// console.log('Part 2')
console.log(part2(linesShort))
console.log(part2(lines))
console.log('-----------------------------------------------------------------')
 