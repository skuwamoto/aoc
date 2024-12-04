const fs = require('fs');

var text = fs.readFileSync('./18.txt', 'utf8')
var lines = text.trim().replace(/ /g, '').split('\n')//.map(x => x.split(''))

var shortText = fs.readFileSync('./18short.txt', 'utf8')
var shortLines = shortText.trim().replace(/ /g, '').split('\n')//.map(x => x.split(''))

function sum(a) {
    return a.reduce((tot, v) => tot + v, 0)
}

function eval1(l, pos) {
    let val = 0
    let newVal, newPos
    let oper = null
    let i = pos
    let c
    for (i=pos; i < l.length; i++) {
        c = l[i]
        switch (c) {
            case '+':
            case '*':
                oper = l[i]
                break
            case '(':
                {
                    [newVal, newPos] = eval1(l, i+1)
                    if (oper == '+') val += newVal
                    else if (oper == '*') val *= newVal
                    else val = newVal
                    oper = null
                    i = newPos
                }
                break
            case ')':
                return [val, i]
                break
            default:
                {
                    newVal = parseInt(l[i])
                    if (oper == '+') val += newVal
                    else if (oper == '*') val *= newVal
                    else val = newVal
                    oper = null 
                }
                break
        }
    }
    return [val, i]
}

function part1(lines) {
    let results = []
    for (let l of lines) {
        let [val, pos] = eval1(l, 0)
        results.push(val)
    }
    return results
}

function getPos(l, c) {
    let braces = 0
    for (let i=0; i < l.length; i++) {
        if (l[i] == '(') braces++
        else if (l[i] == ')') braces--
        
        if (braces == 0 && l[i] == c) {
            return i
        }
    }
    return undefined
}

function eval2(l) {
    // strip outer parens
    if (l[0] == '(') {
        let pPos = getPos(l, ')')
        return eval2( eval2(l.substr(1, pPos-1)) + l.substr(pPos+1) )
    }
    else {
        let tPos = getPos(l, '*')
        if (tPos) {
            return eval2(l.substring(0, tPos)) * eval2(l.substring(tPos+1))
        } else {
            let pPos = getPos(l, '+')
            if (pPos) {
                return eval2(l.substring(0, pPos)) + eval2(l.substring(pPos+1))
            } 
            else {
                return parseInt(l)
            }
        }
    }
}

function part2(lines) {
    let results = []
    for (let l of lines) {
        let val = eval2(l)
        results.push(val)
    }
    return results
}

function part2(lines) {
    return lines.map(x => eval3(x.split('')))
}

console.log('-----------------------------------------------------------------')

console.log('Part 1')
// console.log(part1(shortLines))
// console.log(sum(part1(shortLines)))
// console.log(sum(part1(lines)))
// console.log('--')
console.log('Part 2')
console.log(part2(shortLines))
console.log(part2(lines))
console.log(sum(part2(lines)))
console.log('-----------------------------------------------------------------')
 