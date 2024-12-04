const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test15.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input15.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').join('').split(',')
    return lines
}

test = parse(test)
input = parse(input)

console.log(test)
console.log()

function hash(s) {
    let h = 0
    for (let i=0; i < s.length; i++) {
        h += s.charCodeAt(i)
        h *= 17
        h = h % 256
    }
    return h
}

function partA(lines) {
    let sum = 0

    for (l of lines) {
        sum += hash(l)
    }
    return sum
}

function indexOf(box, label) {
    for (i=0; i < box.length; i++) {
        if (box[i][0] == label) return i
    }
    return -1
}

function remove(boxes, label) {
    let h = hash(label)
    let i = indexOf(boxes[h], label) 
    if (i != -1) {
        boxes[h].splice(i, 1)
    }
}

function add(boxes, label, f) {
    let h = hash(label)
    let i = indexOf(boxes[h], label) 
    if (i != -1) {
        boxes[h][i][1] = f
    } else {
        boxes[h].push([label, f])
    }
}

function partB(lines) {
    let sum = 0
    let boxes = []
    for (let i=0; i < 256; i++) {
        boxes.push([])
    }

    for (let l of lines) {
        if (l.includes('-')) {
            let label = l.before('-')
            remove(boxes, label)
        } else {
            let [label, f] = l.split('=')
            f = Number(f)
            add(boxes, label, f)
        }
    }

    for (i=0; i < boxes.length; i++) {
        for (j=0; j < boxes[i].length; j++) {
            // console.log(i, j, boxes[i][j])
            sum += (i+1) * (j+1) * boxes[i][j][1]
        }
    }

    return sum
}

console.log(partA(test))
console.log(partA(input))
// console.log('--')
console.log(partB(test))
console.log(partB(input))
