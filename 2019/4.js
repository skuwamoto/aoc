const fs = require('fs');
const util = require('util')

let min = 359282
let max = 820401

function partA() {
    count = 0
    for (let i=min; i <= max; i++) {
        let str = String(i)
        let found = false
        let bad = false
        for (let j=1; j<str.length; j++) {
            if (str[j-1] > str[j]) {
                bad = true
            }
            if (str[j-1] == str[j]) {
                found = true
            }
        }
        if (found && !bad) {
            count++
        }
    }
    return count
}

function partB() {
    count = 0
    for (let i=min; i <= max; i++) {
        let str = String(i)
        let found = false
        let bad = false
        for (let j=1; j<str.length; j++) {
            if (str[j-1] > str[j]) {
                bad = true
            }
            if (str[j-1] == str[j]) {
                if (!found) {
                    found = true
                    if (j > 1 && str[j-2] == str[j]) found = false
                    if (j < str.length-1 && str[j+1] == str[j]) found = false
                }
            }
        }
        if (found && !bad) {
            count++
        }
    }
    return count
}

console.log(partA())
console.log(partB())
