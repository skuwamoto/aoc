const fs = require('fs');

var text = fs.readFileSync('./18.txt', 'utf8')
var lines = text.trim().replace(/ /g, '').split('\n')

var shortText = fs.readFileSync('./18short.txt', 'utf8')
var shortLines = shortText.trim().replace(/ /g, '').split('\n')

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

function part2alt(lines) {
    let sum = 0
    for (let l of lines) {
        let q = []
        l = ('('+l+')').split('')
        for (let c of l) {
            if (c == '(' || c == '+' || c == '*') {
                q.push(c)
            } else {
                let val = c
                if (c == ')') {
                    let t
                    val = 1
                    while (t = q.pop()) {
                        if (t == '(')  break
                        else if (t != '*')  val *= t
                    }
                }
                if (q[q.length-1] == '+') {
                    q.pop()
                    q.push(q.pop() + Number(val))
                } else { 
                    q.push(Number(val))
                }
            }
        }
        sum += q[0]
    }
    return sum
}

console.log('-----------------------------------------------------------------')

console.log('Part 1')
// console.log(part1(shortLines))
// console.log(sum(part1(shortLines)))
// console.log(sum(part1(lines)))
// console.log('--')
// console.log('Part 2')
// console.log(part2(shortLines))
// console.log(part2(lines))
// console.log(sum(part2(lines)))
console.log(part2alt(shortLines))
console.log(part2alt(lines))
console.log('-----------------------------------------------------------------')
 