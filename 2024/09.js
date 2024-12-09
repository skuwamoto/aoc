const fs = require('fs');
const u = require('./util2')

let Grid = u.Grid

let test = fs.readFileSync('./test09.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input09.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('').map(Number)
}

test = parse(test)
input = parse(input)

// console.log(test)
// console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

function partA(info) {
    let isSpace = false
    let ssn = 0
    let arr = []
    let nullCount = 0

    // Fill array
    for (let n of info) {
        if (!isSpace) {
            for (let i=0; i<n; i++) {
                arr.push(ssn)
            }
            ssn++
        } else {
            for (let i=0; i<n; i++) {
                arr.push('.')
                nullCount++
            }
        }
        isSpace = !isSpace
    }

    // Pack array
    while (nullCount > 0) {
        let last = arr.pop()
        if (last != '.') {
            let idx = arr.indexOf('.')
            arr[idx] = last
        }
        nullCount--

        // console.log(arr.join(''))
    }

    // Do sum
    let sum = 0
    for (let i=0; i<arr.length; i++) {
        sum += i * arr[i]
    }
    return sum
}

function partB(info) {
    let isSpace = false
    let ssn = 0
    let arr = []
    let nullCount = 0

    let files = []

    // Fill array
    for (let n of info) {
        if (!isSpace) {
            files.push({ pos: arr.length, len: n})
            for (let i=0; i<n; i++) {
                arr.push(ssn)
            }
            ssn++
        } else {
            for (let i=0; i<n; i++) {
                arr.push('.')
                nullCount++
            }
        }
        isSpace = !isSpace
    }

    // Pack array
    for (let id = ssn-1; id > 0; id--) {
        // Find the file info for the id
        let file = files[id]

        // Look for a gap of that size.
        let found = 0
        for (let i=0; i<file.pos; i++) {
            let tooSmall = false
            for (let j=i; j<i+file.len; j++) {
                if (arr[j] != '.') tooSmall = true
            }
            if (!tooSmall) {
                found = i
                break
            }
        }

        if (found) {
            for (let i=0; i < file.len; i++) {
                arr[found+i] = arr[file.pos+i]
                arr[file.pos+i] = '.'
            }
        }
    }

    // Do sum
    let sum = 0
    for (let i=0; i<arr.length; i++) {
        if (arr[i] != '.') {
            sum += i * arr[i]
        }
    }
    return sum
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
console.log(partB(test))
console.log(partB(input))
