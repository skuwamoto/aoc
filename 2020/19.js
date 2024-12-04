const fs = require('fs');

var text = fs.readFileSync('./19.txt', 'utf8')
var [rules, samples] = text.split('\n\n')
rules = rules.trim().split('\n')
samples = samples.trim().split('\n')

var shortText = fs.readFileSync('./19short.txt', 'utf8')
var [shortRules, shortSamples] = shortText.split('\n\n')
shortRules = shortRules.trim().split('\n')
shortSamples = shortSamples.trim().split('\n')

function part1(lines, samples) {
    let rules = {}
    for (let l of lines) {
        let [num, r] = l.split(': ')
        r = r.replace(/"/g, '')
        r = r.replace(/(\d+)/g, "_$1")
        r = r.replace(/\s+/g, '')
        if (r.indexOf('|') !== -1) r = '(' + r + ')'
        rules[num] = r
    }

    while (rules['0'].match("_")) {
        rules['0'] = rules['0'].replace(/_(\d+)/, (match, capture, offset, str) => rules[capture])
    }

    let test = new RegExp('^' + rules['0'] + '$')
    let count = 0
    for (s of samples) {
        if (test.test(s)) {
            count++
        }
    }
    return count
}

function part2(lines, samples) {
    let rules = {}
    for (let l of lines) {
        let [num, r] = l.split(': ')
        r = r.replace(/(\d+)/g, "_$1")
        r = r.replace(/[\"\s]/g, '')
        if (r.indexOf('|') !== -1) r = '(' + r + ')'
        rules[num] = r
    }

    while (rules['0'].match("_")) {
        rules['0'] = rules['0'].replace(/_(\d+)/, (match, capture) => rules[capture])
    }

    let test = new RegExp('^' + rules['0'] + '$')
    return samples.filter(x => test.test(x)).length
}

console.log('-----------------------------------------------------------------')

console.log('Part 1')
console.log(part1(shortRules, shortSamples))
console.log(part1(rules, samples))
console.log('--')
console.log('Part 2')
console.log(part2(shortRules, shortSamples))
console.log(part2(rules, samples))
console.log('-----------------------------------------------------------------')
 