const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

let test = fs.readFileSync('./test22.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input22.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n').map(Number)
}

test = parse(test)
input = parse(input)

// console.log(test)
console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

function step(secret) {
    secret = BigInt(secret)
    // console.log(secret)

    let next = BigInt(secret)
    next <<= 6n 
    next ^= secret
    secret = next

    // console.log(secret)
    next %= 16777216n
    secret = next
    // console.log(secret)

    next >>=5n
    next ^= secret
    secret = next

    // console.log(secret)
    next %= 16777216n
    secret = next

    next <<= 11n
    next ^= secret
    secret = next

    // console.log(secret)
    next %= 16777216n
    secret = next

    // console.log(secret)
    // console.log('-----')
    return next
}


function partA(info) {
    let sum = 0n

    for (secret of info) {
        let init = BigInt(secret)
        for (let i=0; i < 2000; i++) {
            secret = step(secret)
        }
        sum += secret
        // console.log(init, '->', secret)
    }

    return sum
}

function partB(info) {
    let result = []

    let sums = new Map()

    let maxKey = null
    let max = 0

    for (secret of info) {
        let found = new Map()
        // console.log('secret is', secret)
        let lastFour = []
        let all = []
        for (let i=0; i < 2000; i++) {
            let prev = BigInt(secret)
            let prevDigit = prev % 10n

            secret = step(secret)
            let secretDigit = secret % 10n 

            let diffDigit = secretDigit - prevDigit
            all.push(Number(diffDigit))

            lastFour.push(diffDigit)
            if (lastFour.length > 4) {
                lastFour.shift()
            }
            if (lastFour.length == 4) {
                let key = lastFour.join(',')
                if (!found.has(key)) {
                    if (!sums.has(key)) sums.set(key, 0n)

                    sums.set(key, sums.get(key) + secretDigit)

                    if (sums.get(key) > max) {
                        max = sums.get(key)
                        maxKey = key

                        // console.log('maxkey is now', maxKey)
                    }
                    found.set(key, true)
                }
            }
        }
        // console.log(all.join(','))
    }

    return max
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
console.log(partB(input))
