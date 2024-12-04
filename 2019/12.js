const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test12.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input12.txt', {encoding:'utf8', flag:'r'});

test = parse(test)
input = parse(input)

// console.log(test)
// console.log()

// console.log(test)

function parse(lines) {
    return lines.split('\n').map(x => x.between('<', '>').lsplitMap('=', ', ', Number))
}

function step(pos) {
    for (let i=0; i < pos.length; i++) {
        for (let j=0; j < pos.length; j++) {
            if (i == j) continue
            let p1 = pos[i]
            let p2 = pos[j]
            p1.vx += Math.sign(p2.x-p1.x)
            p1.vy += Math.sign(p2.y-p1.y)
            p1.vz += Math.sign(p2.z-p1.z)
        }
    }

    for (p of pos) {
        p.x += p.vx
        p.y += p.vy
        p.z += p.vz
    }
}

function partA(lines) {
    let pos = []

    for (l of lines) {
        pos.push(Object.assign({}, l, {vx: 0, vy: 0, vz: 0}))
    }

    console.log(pos)

    for (i=0; i < 1000; i++) {
        step(pos)
        // console.log(pos)
    }

    let sum = 0
    for (p of pos) {
        sum += (Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z)) * (Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.vz))
    }
    return sum

}

function hash(pos) {
    pos = JSON.parse(JSON.stringify(pos))

    // console.log('orig')
    // console.log(pos)

    // Sort by size
    pos.sort((a, b) => {
        if (Math.abs(a.x) != b.x) return Math.abs(a.x)-Math.abs(b.x)
        if (Math.abs(a.y) != Math.abs(b.y)) return Math.abs(a.y)-Math.abs(b.v)
        if (Math.abs(a.z) != Math.abs(b.z)) return Math.abs(a.z)-Math.abs(b.z)
        if (Math.abs(a.vx) != Math.abs(b.vx)) return Math.abs(a.vx)-Math.abs(b.vx)
        if (Math.abs(a.vy) != Math.abs(b.vy)) return Math.abs(a.vy)-Math.abs(b.vy)
        if (Math.abs(a.vz) != Math.abs(b.vz)) return Math.abs(a.vz)-Math.abs(b.vz)
        throw new Error('')
        return 0
    })

    // console.log('sorted')
    // console.log(pos)

    // Swap axes by size based on the first item (or second item if tied)
    let order = ['x', 'y', 'z']
    order.sort((a, b) => {
        if (Math.abs(pos[0][a]) != Math.abs(pos[0][b])) return Math.abs(pos[0][a])-Math.abs(pos[0][b])
        if (Math.abs(pos[1][a]) != Math.abs(pos[1][b])) return Math.abs(pos[1][a])-Math.abs(pos[1][b])
        if (Math.abs(pos[2][a]) != Math.abs(pos[2][b])) return Math.abs(pos[2][a])-Math.abs(pos[2][b])
        if (Math.abs(pos[3][a]) != Math.abs(pos[3][b])) return Math.abs(pos[3][a])-Math.abs(pos[3][b])
        throw new Error('')
        return 0
    })

    pos = pos.map(p => { 
        let result = {}
        result.x  = p[order[0]]
        result.y  = p[order[1]]
        result.z  = p[order[2]]
        result.vx = p['v'+order[0]]
        result.vy = p['v'+order[1]]
        result.vz = p['v'+order[2]]
        return result
    })

    // console.log('axes swapped')
    // console.log(pos)

    // Flip signs
    let signs = [0, 0, 0]
    for (p of pos) {
        signs[0] = signs[0] || Math.sign(p.x)
        signs[1] = signs[1] || Math.sign(p.y)
        signs[2] = signs[2] || Math.sign(p.z)
    }

    for(i in pos) {
        pos[i].x = signs[0] * pos[i].x
        pos[i].y = signs[1] * pos[i].y
        pos[i].z = signs[2] * pos[i].z
    }

    // console.log('flipped')
    // console.log(pos)

    return JSON.stringify(pos)
}

function posSlice(pos, axis) {
    return pos.map(p => p[axis] + ':' + p['v'+axis]).join(',')
}

function partB(lines) {
    let pos = []
    let cache = {}
    cache.x = new Map()
    cache.y = new Map()
    cache.z = new Map()

    for (l of lines) {
        pos.push(Object.assign({}, l, {vx: 0, vy: 0, vz: 0}))
    }

    let posX = posSlice(pos, 'x')
    let posY = posSlice(pos, 'y')
    let posZ = posSlice(pos, 'z')

    cache.x[posX] = posX
    cache.y[posY] = posY
    cache.z[posZ] = posZ

    console.log('pos', pos)
    console.log('posX', posX)
    console.log('posY', posY)
    console.log('posZ', posZ)

    let periodX = 0
    let periodY = 0
    let periodZ = 0


    for (let i=0; !periodX || !periodY || !periodZ; i++) {
        step(pos)

        posX = posSlice(pos, 'x')
        posY = posSlice(pos, 'y')
        posZ = posSlice(pos, 'z')

        if (cache.x[posX] && !periodX) {
            periodX = i
        }

        if (cache.y[posY] && !periodY) {
            periodY = i
        }

        if (cache.z[posZ] && !periodZ) {
            periodZ = i
        }

        cache.x[posX] = posX
        cache.y[posY] = posY
        cache.z[posZ] = posZ
    }

    return u.lcm([periodX+1, periodY+1, periodZ+1])
}

// console.log(partA(test))
// console.log(partA(input))
console.log('--')
// console.log(partB(test))
console.log(partB(input))

