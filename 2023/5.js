const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test5.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input5.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n\n')
    seeds = lines.shift()
    seeds = seeds.after(' ').split(' ').map(Number)

    maps = lines.map(x => {
        let l = x.split('\n')
        let [source, dest] = l.shift().before(' ').split('-to-')
        let shifts = l.map(y => y.split(' ').map(Number))
        shifts = shifts.map(y => ({ start: y[1], end: y[1]+y[2]-1, by: y[0]-y[1] }))
        shifts.sort((a,b) => a.start-b.start)
        return {source, dest, shifts}
    })

    let mm = {}
    for (m of maps) {
        mm[m.source] = m
    }

    return {seeds, maps: mm}
}
test = parse(test)
input = parse(input)

console.log(test)
console.log(test.maps['fertilizer'])

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
            result..(rr)
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
        let cur = 'seed'
        while (cur != 'location') {
            let map = info.maps[cur]
            num = shiftNum(map.shifts, num)
            cur = map.dest
        }
        least = Math.min(least, num)
    }
    return least
}

function partB(info) {
    let ranges = []
    for (let i=0; i < info.seeds.length; i += 2) {
        ranges.push({start: info.seeds[i], end: info.seeds[i] + info.seeds[i+1]-1})
    }
    sortRanges(ranges)

    let cur = 'seed'
    while (cur != 'location') {
        let map = info.maps[cur]
        let newRanges = shiftRanges(map.shifts, ranges)
        cur = map.dest
        ranges = newRanges
    }
    console.log(ranges)
    return ranges[0].start
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
console.log(partB(test))
console.log(partB(input))
