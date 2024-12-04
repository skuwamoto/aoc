const fs = require('fs');

var text = fs.readFileSync('./21.txt', 'utf8')
var parts = text.trim().split('\n\n')
var lines = text.trim().split('\n')

// array to num
//.map(x => parseInt(x))

// reverse array
//.split('').reverse().join('')

// str to array
//.split('') 



var shortText = fs.readFileSync('./21short.txt', 'utf8')
var shortParts = shortText.trim().split('\n\n')
var shortLines = shortText.trim().split('\n')

function part1(lines) {
    let suspect = {}
    let allIng = {}

    for (let l of lines) {
        let [ing, al] = l.split(' (contains ')
        ing = ing.split(' ')
        al = al.substring(0, al.length-1).split(', ')

        for (let a of al) {
            if (!suspect[a]) {
                suspect[a] = ing
            } else {
                suspect[a] = suspect[a].filter(x => ing.indexOf(x) != -1)
            }
        }
        for (let i of ing) {
            allIng[i] = true
        }
    }

    for (let a in suspect) {
        suspect[a].forEach(x => allIng[x] = false)        
    }

    let count = 0
    for (let l of lines) {
        let [ing, al] = l.split(' (contains ')
        ing = ing.split(' ').filter(x => allIng[x] == true)
        count += ing.length
    }
    return count
}

function part2(lines) {
    let suspect = {}
    let allIng = {}

    for (let l of lines) {
        let [ing, al] = l.split(' (contains ')
        ing = ing.split(' ')
        al = al.substring(0, al.length-1).split(', ')

        for (let a of al) {
            if (!suspect[a]) {
                suspect[a] = ing
            } else {
                suspect[a] = suspect[a].filter(x => ing.indexOf(x) != -1)
            }
        }
    }

    let more 
    do {
        more = false
        for (let a of Object.keys(suspect)) {
            if (suspect[a].length == 1) {
                for (let b of Object.keys(suspect)) {
                    if (a !== b) {
                        suspect[b] = suspect[b].filter(x => x != suspect[a][0])
                    }
                }
            }
            if (suspect[a].length > 1) {
                more = true
            }
        }
    } while(more)

    let result = []
    for (let a of Object.keys(suspect).sort()) {
        console.log(a, suspect[a])

        if (suspect[a].length == 1) {
            result.push(suspect[a][0])
        }
    }
    return result.join(',')
}

console.log('-----------------------------------------------------------------')
console.log('Part 1')
console.log(part1(shortLines))
console.log(part1(lines))
console.log('--')
console.log('Part 2')
console.log(part2(shortLines))
console.log(part2(lines))
console.log('-----------------------------------------------------------------')
 