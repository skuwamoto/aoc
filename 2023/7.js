const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test7.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input7.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n').map(x => ({ hand: x.before(' ').split(''), bid: Number(x.after(' ')) }))
}

test = parse(test)
input = parse(input)

points = {
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    'T': 'A',
    'J': 'B',
    'Q': 'C',
    'K': 'D',
    'A': 'E'
}

function getScore(hand) {
    let counts = {}
    for (c of hand) {
        counts[c] = !counts[c] ? 1 : counts[c]+1
    }
    let s = new Set(Object.values(counts))
    let numKeys = Object.keys(counts).length
    let score = 0

    if (s.has(5)) score = 7
    else if (s.has(4)) score = 6
    else if (s.has(3) && s.has(2)) score = 5
    else if (s.has(3)) score = 4
    else if (s.has(2) && numKeys == 3) score = 3
    else if (s.has(2) && numKeys == 4) score = 2
    else score = 1
    
    return score
}

function getScore2(hand) {
    let best = 0

    for (trycard in points) {
        if (trycard == 'J') continue
        let h = hand.concat().map(x => (x == 'J') ? trycard : x)
        let score = getScore(h)

        if (score > best) best = score
    }
    
    return best
}

function getScore2a(hand) {
    let counts = {}
    let jj = 0
    for (c of hand) {
        if (c == 'J') jj++
        else counts[c] = !counts[c] ? 1 : counts[c]+1
    }
    let s = new Set(Object.values(counts))
    let score = 0

    let numKeys = Object.keys(counts).length

    // Five of a kind
    if (s.has(5) || 
        (s.has(4) && jj == 1) || 
        (s.has(3) && jj == 2) ||
        (s.has(2) && jj == 3) ||
        (s.has(1) && jj == 4)) 
    {
        score = 7
    }
    // Four of a kind
    else if (s.has(4) || 
             (s.has(3) && jj == 1) ||
             (s.has(2) && jj == 2) ||
             (s.has(1) && jj == 3))
    {
        score = 6        
    } 
    // Full House
    else if ((s.has(3) && s.has(2)) ||
             (s.has(2) && numKeys == 2 && jj == 1))
    {
        score = 5
    } 
    // Three of a kind
    else if (s.has(3) || (s.has(2) && jj == 1) || (s.has(1) && jj == 2))
    {
        if (jj) console.log(hand.join(''), jj, "three")
        score = 4
    }
    // Two pair
    else if ((s.has(2) && numKeys == 3) || (s.has(2) && jj == 1))
    {
        if (jj) console.log(hand.join(''), jj, "two pair")
        score = 3
    }
    // One pair
    else if (s.has(2) || jj == 1) 
    {
        if (jj) console.log(hand.join(''), jj, "pair")
        score = 2
    }
    else 
    {
        if (jj) console.log(hand.join(''), jj, "high card")
        score = 1
    }
    
    return "" + score + ',' + hand.map(x => points2[x]).join('')
}

function partA(lines) {
    for (l of lines) {
        l.score = "" + getScore(l.hand) + ',' + l.hand.map(x => points[x]).join('')
    }
    lines.sort((a,b) => a.score > b.score ? 1 : a.score < b.score ? -1 : 0)

    let sum = 0
    for (i of lines.keys()) {
        l = lines[i]
        sum += l.bid * (i+1)
    }
    return sum
}

function partB(lines) {
    for (l of lines) {
        l.score = "" + getScore2(l.hand) + ',' + l.hand.map(x => (x == 'J') ? '0' : points[x]).join('')
    }
    lines.sort((a,b) => a.score > b.score ? 1 : a.score < b.score ? -1 : 0)

    let sum = 0
    for (i of lines.keys()) {
        l = lines[i]
        sum += l.bid * (i+1)
    }
    return sum
}

// console.log(partA(test))
// console.log(partA(input))
// // console.log('--')
// console.log(partB(test))
console.log(partB(input))
