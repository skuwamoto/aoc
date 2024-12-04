const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test02.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input02.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => x.split(' ').map(Number))
    return lines
}

test = parse(test)
input = parse(input)

// console.log(test)
// console.log(input)

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

function issafe(line) {
    let inc = line[1] > line[0]
    let safe = true
    for (let i=0; i < line.length - 1; i++) {
        if (inc) {
            if (line[i+1] <= line[i] || line[i+1] > line[i]+3) {
                // console.log(line, '=>', line[i], line[i+1])
                safe = false
            }
        } else {
            if (line[i+1] >= line[i] || line[i+1] < line[i]-3) {
                // console.log(line, '=>', line[i], line[i+1])
                safe = false
            }
        }
    }
    return safe
}

function partA(info) {
    let num = 0
    for (line of info) {
        if (issafe(line)) num++
    }
    return num
}

function partB(info) {
    let num = 0;
    for (line of info) {
        let safe = false
        if (issafe(line)) {
            console.log(line, 'is safe')
            safe = true
        }

        for (let i=0; i < line.length; i++) {
            if (!safe) {
                let ll = [...line]
                ll.splice(i, 1)
                if (issafe(ll)) {
                    console.log(line, 'is safe after removing', i)
                    safe = true
                }
            }
        }

        if (safe) {
            num++ 
        }
        else {
            console.log(line, 'is unsafe')
        }
    }
    return num
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
console.log(partB(input))
