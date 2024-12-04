const fs = require('fs');

let test = fs.readFileSync('./test1.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input1.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n')
}

test = parse(test)
input = parse(input)

digits = ['blahblah', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

function numAt(str, i) {
    if (str[i] >= '0' && str[i] <= '9') return str[i]
    for (d in digits) {
        if (str.substr(i, digits[d].length) == digits[d]) return d
    }
    return null
}

function partA(lines) {
    let sum = 0
    for (let l of lines) {
        first = last = null
        for (let i=0; i < l.length; i++) {
            let n = numAt(l, i)
            if (n != null) {
                if (first == null) first = n
                last = n
            }
        }
        sum += Number("" + first + last)
    }
    return sum
}

console.log(partA(test))
console.log(partA(input))

