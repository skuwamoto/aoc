const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test5.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input5.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n\n')

    return {
        seeds: lines.shift().after(' ').split(' ').map(Number),
        shiftMaps: lines.map(x => {
            x = x.split('\n')
            x.shift()
            let s = x.map(y => y.split(' ').map(Number))
                    .map(z => ({start: z[1], end:z[1]+z[2]-1, by: z[0]-z[1]}))
            s.sort((a,b) => a.start - b.start)
            return s 
        })
    }
}
test = parse(test)
input = parse(input)

// Maps a number through a shift
function shiftNum(shifts, num) {
    for (s of shifts) {
        if (num >= s.start && num <= s.end) return num + s.by
    }
    return num
}

// Maps a list of ranges through a shift, eg [{start:xx, end:xx}, {start:xx, end:xx}]
function shiftRanges(shifts, ranges) {
    let result = []
    for (r of ranges) {
        result = result.concat(shiftOneRange(shifts, r))
    }
    sortRanges(result)
    return result
}

function shiftOneRange(shifts, r) {
    // clone the object just to be sure.
    let rr = { start: r.start, end: r.end }

    let result = []
    let done = false
    for (let s of shifts) {
        if (rr.end < s.start) {
            result.push(rr)
            done = true
            break
        }
        if (rr.start < s.start) {
            result.push({start: rr.start, end: s.start-1})
            rr.start = s.start
        }
        if (rr.end <= s.end) {
            result.push({start: shiftNum(shifts, rr.start), end: shiftNum(shifts, rr.end)})
            done = true
            break
        }
        if (rr.start <= s.end) {
            result.push({start: shiftNum(shifts, rr.start), end: shiftNum(shifts, s.end)})
            rr.start = s.end+1
        }
    }
    if (!done) {
        result.push({start: rr.start, end: rr.end})
    }
    sortRanges(result)
    return result
}

function sortRanges(ranges) {
    ranges.sort((a, b) => a.start - b.start)
}

function partA(info) {
    let least = 999999999999999
    for (s of info.seeds) {
        let num = s
        for (shifts of info.shiftMaps) {
            num = shiftNum(shifts, num)
        }
        least = Math.min(least, num)
    }
    return least
}

function partB(info) {
    let ranges = []
    let seeds = info.seeds

    for (let i=0; i < seeds.length; i += 2) {
        ranges.push({start: seeds[i], end: seeds[i] + seeds[i+1]-1})
    }
    sortRanges(ranges)

    for (shifts of info.shiftMaps) {
        ranges = shiftRanges(shifts, ranges)
    }
    return ranges[0].start
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
