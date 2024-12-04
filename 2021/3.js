const fs = require('fs');

let test = fs.readFileSync('./test3.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input3.txt', {encoding:'utf8', flag:'r'});

test = test.split('\n')
input = input.split('\n')
// test = test.map(x => Number(x))
// input = input.map(x => Number(x))


function partA(a) {
    let len = a[0].length
    let one = []
    let zero = []

    for (let i=0; i < len; i++) {
        one.push(0)
        zero.push(0)        
    }

    for (let line of a) {
        for (let i=0; i<len; i++) {
            if (line[i] == '0') {
                zero[i] = zero[i]+1
            } else {
                one[i] = one[i]+1
            }
        }
    }

    let gamma = ""
    let epsilon = ""

    for (let i=0; i<len; i++) {
        if (one[i] > zero[i]) {
            gamma += "1"
            epsilon += "0"
        } else {
            gamma += "0"
            epsilon += "1"
        }
    }

    return parseInt(gamma, 2) * parseInt(epsilon, 2)
}

function partB(a) {
    let len = a[0].length

    // go position by position
    let oxy = a

    for (let i=0; i<len; i++) {
        let zeros = 0
        let ones = 0

        for (let line of oxy) {
            if (line[i] == '1') {
                ones++
            } else {
                zeros++
            }
        }

        if (ones >= zeros) {
            oxy = oxy.filter(x => x[i] == '1')
        } else {
            oxy = oxy.filter(x => x[i] == '0')
        }

        if (oxy.length == 1) break
    }

    let co2 = a

    for (let i=0; i<len; i++) {
        let zeros = 0
        let ones = 0

        for (let line of co2) {
            if (line[i] == '1') {
                ones++
            } else {
                zeros++
            }
        }

        if (ones < zeros) {
            co2 = co2.filter(x => x[i] == '1')
        } else {
            co2 = co2.filter(x => x[i] == '0')
        }

        if (co2.length == 1) break
    }


    return parseInt(oxy, 2) * parseInt(co2, 2)
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))

