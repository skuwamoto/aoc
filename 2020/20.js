const fs = require('fs');

var text = fs.readFileSync('./20.txt', 'utf8')
var tiles = text.trim().split('\n\n')

var shortText = fs.readFileSync('./20short.txt', 'utf8')
var shortTiles = shortText.trim().split('\n\n')

//      t             lr            br            r             tr            rr            b             l       
//    0...n         n...0         n...0         0...n         n...0         n...0         0...n         0...n     
//   0     0       0     0       n     n       n     n       0     0       n     n       n     n       0     0    
// l .     . r   b .     . t  rr .     . lr tr .     . br  r .     . l  br .     . tr lr .     . rr  t .     . b  
//   n     n       n     n       0     0       0     0       n     n       0     0       0     0       n     n    
//    0...n         n...0         n...0         0...n         n...0         n...0         0...n         0...n     
//      b             rr            tr            l             br            lr            t             r       

function getEdgeInfo(id, info, orient) {
    switch (orient) {
        case 0: return {id, orient, lines: info.lines, l: info.l,  r: info.r,  t: info.t,  b: info.b}
        case 1: return {id, orient, lines: info.lines, l: info.b,  r: info.t,  t: info.lr, b: info.rr}
        case 2: return {id, orient, lines: info.lines, l: info.rr, r: info.lr, t: info.br, b: info.tr}
        case 3: return {id, orient, lines: info.lines, l: info.tr, r: info.br, t: info.r,  b: info.l}
        case 4: return {id, orient, lines: info.lines, l: info.r,  r: info.l,  t: info.tr, b: info.br}
        case 5: return {id, orient, lines: info.lines, l: info.br, r: info.tr, t: info.rr, b: info.lr}
        case 6: return {id, orient, lines: info.lines, l: info.lr, r: info.rr, t: info.b,  b: info.t}
        case 7: return {id, orient, lines: info.lines, l: info.t,  r: info.b,  t: info.l,  b: info.r}
    }
}

function rot(lines) {
    let result = []
    for (let i = 0; i < lines[0].length; i++) {
        result.push('')
        for (let j=0; j < lines.length; j++) {
            result[i] += lines[lines.length-1-j][i]
        }
    }
    return result
}

function flip(lines) {
    let result = []
    for (let i = 0; i < lines.length; i++) {
        result.push(lines[i].split('').reverse().join(''))
    }
    return result
}

function addRight(i1, i2) {
    let result = []
    for (let i = 0; i < i1.length; i++) {
        result.push(i1[i] + i2[i])
    }
    return result
}

function flipAndTrim(info) {
    let lines = info.lines

    let trimmed = []
    for (let i=1; i<lines.length-1; i++) {
        trimmed.push(lines[i].substring(1, lines[0].length-1))
    }

    switch (info.orient) {
        case 0: return trimmed
        case 1: return rot(trimmed)
        case 2: return rot(rot(trimmed))
        case 3: return rot(rot(rot(trimmed)))
        case 4: return flip(trimmed) 
        case 5: return rot(flip(trimmed))
        case 6: return rot(rot(flip(trimmed)))
        case 7: return rot(rot(rot(flip(trimmed))))
    }
}

function tryTiles(info, m, used, i, j) {
    let w = (i > 0) ? m[0].length : null

    if (i > m.length-1) {
        m.push([])
    }

    for (let id in info) {
        if (used[id]) continue

        let t = info[id]
        for (let orient=0; orient < 8; orient++) {
            let edges = getEdgeInfo(id, info[id], orient)
            if ( (i == 0 || m[i-1][j].b == edges.t) && (j == 0 || m[i][j-1].r == edges.l)) {
                m[i][j] = edges
                used[id] = true
                let success
                if (Object.keys(used).length == Object.keys(info).length && j == w-1) {
                    success = true
                } else if (i == 0) {
                    success = tryTiles(info, m, used, i+1, 0)
                    if (!success) success = tryTiles (info, m, used, i, j+1)
                } else if (j == w-1) {
                    success = tryTiles(info, m, used, i+1, 0)
                } else {
                    success = tryTiles(info, m, used, i, j+1)
                }
                if (success) return true

                delete used[id]
            }
        }
    }
    // couldn't find one. clean up so we can measure h and w accurately
    if (i == 0) {
        m[0].length = j
    } else if (j == 0) {
        m.length = i
    }
    return false
}

function getTileMap(tiles) {
    let info = {}
    // collect signatures
    for (let t of tiles) {
        let lines = t.split('\n')
        let header = lines.shift()
        let id = header.substring(5, header.length-1)
        info[id] =  {
            t: lines[0],
            l: lines.map(l => l[0]).join(''),
            r: lines.map(l => l[l.length-1]).join(''),
            b: lines[lines.length-1]
        }
        info[id].tr = info[id].t.split('').reverse().join('')
        info[id].lr = info[id].l.split('').reverse().join('')
        info[id].rr = info[id].r.split('').reverse().join('')
        info[id].br = info[id].b.split('').reverse().join('')
        info[id].lines = lines
    }

    // recursively try everything
    let m = []
    let used = {}

    tryTiles(info, m, used, 0, 0)

    return m
}

function part1(tiles) {
    let m = getTileMap(tiles)

    let w = m[0].length
    let h = m.length

    return Number(m[0][0].id) * Number(m[0][w-1].id) * Number(m[h-1][0].id) * Number(m[h-1][w-1].id)
}

function part2(tiles) {
    let m = getTileMap(tiles)

    // Stitch together full map
    let map = []
    for (let i=0; i<m.length; i++) {
        let tile = flipAndTrim(m[i][0])
        for (let j=1; j < m[i].length; j++) {
            tile = addRight(tile, flipAndTrim(m[i][j]))
        }
        map.push(...tile)
    }

    // Look for seamonsters
    let s = [
        '                  # ',
        '#    ##    ##    ###',
        ' #  #  #  #  #  #   '
    ]

    let ss = [
        s, rot(s), rot(rot(s)), rot(rot(rot(s))), flip(s), rot(flip(s)), rot(rot(flip(s))), rot(rot(rot(flip(s))))
    ]

    for (let pat of ss) {
        for (let i=0; i < map.length - pat.length + 1; i++) {
            for (let j=0; j < map[0].length - pat[0].length + 1; j++) {
                let fail = false
                for (let ii=0; ii < pat.length; ii++) {
                    for (let jj=0; jj < pat[0].length; jj++) {
                        if (pat[ii][jj] == '#' && (map[i+ii][j+jj] != '#' && map[i+ii][j+jj] != 'O')) {
                            fail = true
                            break
                        }
                    }
                    if (fail) break
                }
                if (!fail) {
                    for (let ii=0; ii < pat.length; ii++) {
                        for (let jj=0; jj < pat[0].length; jj++) {
                            map[i+ii] = map[i+ii].split('')
                            if (pat[ii][jj] == '#' && map[i+ii][j+jj] == '#') {
                                map[i+ii][j+jj] = 'O'
                            } 
                            map[i+ii] = map[i+ii].join('')
                        }
                    }
                }
            }
        }
    }

    console.log(map)

    let sum = 0
    for (let i=0; i < map.length; i++) {
        for (let j=0; j < map[0].length; j++) {
            if (map[i][j] == '#') sum++
        }
    }
    return sum
}

console.log('-----------------------------------------------------------------')

// console.log('Part 1')
// console.log(part1(shortTiles))
// console.log(part1(tiles))
console.log('--')
console.log('Part 2')
console.log(part2(shortTiles))
console.log(part2(tiles))
console.log('-----------------------------------------------------------------')
 