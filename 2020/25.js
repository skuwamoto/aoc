const fs = require('fs');

// array to num
//.map(x => parseInt(x))

// reverse array
//.split('').reverse().join('')

// str to array
//.split('') 

var text = fs.readFileSync('./25.txt', 'utf8')
var [door, card] = text.trim().split('\n').map(x => Number(x))

var textShort = fs.readFileSync('./25short.txt', 'utf8')
var [doorShort, cardShort] = textShort.trim().split('\n').map(x => Number(x))


function part1(door, card) {
    let d = 0
    let c = 0
    let sub = 7
    let dnum = 1
    let cnum = 1

    console.log('looking for door:', door)

    do {
        d++
        dnum *= sub
        dnum %= 20201227
    } while (dnum != door)

    console.log('looking for card', card)
    do {
        c++
        cnum *= sub
        cnum %= 20201227
    } while (cnum != card)

    let key = 1
    for (let i=0; i < d; i++) {
        key *= card
        key %= 20201227
    }
    return key
}

function part2(lines) {
}

console.log('-----------------------------------------------------------------')
console.log('Part 1')
console.log(part1(doorShort, cardShort))
console.log(part1(door, card))
console.log('--')
// console.log('Part 2')
// console.log(part2(linesShort))
// console.log(part2(lines))
console.log('-----------------------------------------------------------------')
 