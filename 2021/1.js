const fs = require('fs');

let test = fs.readFileSync('./test1.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input1.txt', {encoding:'utf8', flag:'r'});

test = test.split('\n').map(x => Number(x))
input = input.split('\n').map(x => Number(x))

function count(array) {
    let last = null
    let result = 0
    for (let n of array) {
        if (last !== null && n > last) {
            result++
        }
        last = n
    }

    return result
}

function count3(a) {
    let result = 0
    for (let i = 0; i < (a.length-3); i++) {
        if (a[i+3] > a[i])
            result++
    }
    return result
}

console.log(count(test))
console.log(count(input))
console.log('--')
console.log(count3(test))
console.log(count3(input))

