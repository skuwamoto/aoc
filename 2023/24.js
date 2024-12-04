const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test24.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input24.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => x.split('@').map(y => y.split(',').map(z => Number(z.trim()))))
    return lines
}

test = parse(test)
input = parse(input)

// console.log(test)
// console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()


// x + y + t(vx)
// => (x, y) = (px + t*vx, py + t*vy)
// 
// y = py + t * vy
// x = px + t * vx
// 
// t * vx = (x - px)
// t = (x - px) / vx
// 
// y = py1 + (x-px1) * vy1 / vx1
// y = py2 + (x-px2) * vy2 / vx2
// 
// (x-px1) * vy1 / vx1 - [ (x-px2) * vy2 / vx2 ] = py2 - py1
// 
// x * (vy1 /vx1 - vy2 / vx2) = py2 - py1 + px1 * vy1/vx1 - px2 * vy2 / vx2
// 
// x = (py2 - py1) + (px1 * vy1 / vx1) - (px2 * vy2 / vx2) 
//     ---------------------------------------------------
//                (vy1 / vx1 - vy2 / vx2)
// 
// y = py1 + (x-px1) * vy1 / vx1

function intersectXY(a, b) {
    let [[px1, py1, pz1], [vx1, vy1, vz1]] = a
    let [[px2, py2, pz2], [vx2, vy2, vz2]] = b

    let interX = ( (py2 - py1) + (px1 * vy1 / vx1) - (px2 * vy2 / vx2) ) / (vy1 / vx1 - vy2 / vx2)
    let interY = py1 + (interX - px1) * vy1 / vx1

    let t1 = (interX-px1) / vx1
    let t2 = (interX-px2) / vx2

    return [interX, interY, t1, t2]
}

function doesIntersectXYZ(a, b) {
    let [[px1, py1, pz1], [vx1, vy1, vz1]] = a
    let [[px2, py2, pz2], [vx2, vy2, vz2]] = b

    let i1 = intersectXY(a, b)
    let i2 = intersectXY(...flipXZ([a, b]))

    if (i1[1] == i2[1] && i1[2] == i2[2]) {
        console.log('found!!', i1[0], i1[1], i2[0], i1[0] + i1[1] + i2[0])
    }

    // let interX = ( (py2 - py1) + (px1 * vy1 / vx1) - (px2 * vy2 / vx2) ) / (vy1 / vx1 - vy2 / vx2)
    // let interY = py1 + (interX - px1) * vy1 / vx1

    // let t1 = (interX-px1) / vx1
    // let t2 = (interX-px2) / vx2

    // return [interX, interY, t1, t2]
}

let maxCompare = 100000

function getAllIntersections(info) {
    let results = []
    for (let i=0; i < info.length && i < maxCompare; i++)  {
        for (let j = i+1; j < info.length && j < maxCompare; j++) {
            results.push(intersectXY(info[i], info[j]))
        }
    }

    return results
}

function partA(info, min, max) {
    let sum = 0

    for (let [interX, interY, t1, t2] of getAllIntersections(info)) {
        if (t1 > 0 && t2 > 0 && interX >= min && interX <= max && interY >= min && interY <= max) {
            sum++
        }
    }

    return sum
}

function meanXYZ(inter) {
    let xSum = 0
    let ySum = 0
    let zSum = 0
    let count = 0
    for (let p of inter) {
        if (Number.isFinite(p[0]) && Number.isFinite(p[1]) && Number.isFinite(p[2])) {
            xSum += p[0]
            ySum += p[1]
            zSum += p[2]
            count++
        }
    }
    return [xSum / count, ySum / count, zSum / count]
}

function deviation(inter) {
    let [mx, my] = meanXYZ(inter)
    let sqSum = 0
    let count = 0

    for (let p of inter) {
        if (Number.isFinite(p[0]) && Number.isFinite(p[1])) {
            sqSum += (p[0]-mx) * (p[0]-mx) + (p[1]-my) * (p[1]-my)
            count++
        } else {
            // return Math.POSITIVE_INFINITY
        }
    }
    return Math.sqrt(sqSum / count)
}

function flipXZ(info) {
    let result = []
    for (let line of info) {
        result.push([
            [line[0][2], line[0][1], line[0][0] ],
            [line[1][2], line[1][1], line[1][0] ]
        ])
    }
    return result
}

function transform(info, pos, vel) {
    let result = []
    for (let line of info) {
        result.push([
            [line[0][0] - pos[0], line[0][1] - pos[1], line[0][2] - pos[2] ],
            [line[1][0] - vel[0], line[1][1] - vel[1], line[1][2] - vel[2] ]
        ])
    }
    return result
}

function randomInt(min, max) {
  // return Math.floor(Math.random() * (max+1-min)) + min;
  return (Math.random() * (max+1-min)) + min;
}

function round(x) { 
    return x
    return Math.round(x)
}

function partB(info) {
    let sum = 0

    let best = Number.POSITIVE_INFINITY
    let bestVel = [0, 0, 0]

    let range = 400


    // // positions
    // info.map(x => console.log(x[0].join(', ')))

    // // velocities
    // info.map(x => console.log(x[1].join(', ')))

    // let int = getAllIntersections(info)
    // int = int.filter(x => x[2] > 0 && x[3] > 0 && Number.isFinite(x[0]) && Number.isFinite(x[1]))

    // int.map(x => console.log([x[0], x[1]].join(', ')))

    // return

    // Try all velocities, to find the smallest deviation
    for (let vx=25; vx <= 30; vx+=1) {
        for (let vy=-300; vy <= -250; vy+=1) {
            let vel = [
                vx,
                vy,
                0
            ]

            let inter = getAllIntersections(transform(info, [0,0,0], vel))
            let dev = deviation(inter)

            // console.log(dev, 'deviation for', vel)
            if (dev < best) {
                best = dev
                bestVel = vel
            }
        }
    }

    let bestZ = Number.POSITIVE_INFINITY

    for (let vz=-200; vz < 200; vz++) {
        let vel = [
            bestVel[0],
            bestVel[1],
            vz
        ]

        let inter = getAllIntersections(flipXZ(transform(info, [0,0,0], vel)))
        let dev = deviation(inter)

        // console.log(dev, 'deviation in Z for', vel)
        if (dev < bestZ) {
            bestZ = dev
            bestVel = vel
        }
    }

    let transformedStuff = transform(info, [0,0,0], bestVel)
    for (t1 of transformedStuff) {
        for (t2 of transformedStuff) {
            doesIntersectXYZ(t1, t2)
        }
    }
    return

    let bestInter = getAllIntersections(transformedStuff)
    let bestMeanXY = meanXYZ(bestInter)
    // bestInter = getAllIntersections(transform(info, [round(bestMeanXY[0]), round(bestMeanXY[1]), 0], bestVel))
    // let meanAdjustXY = meanXYZ(bestInter)

    // let mean = [round(bestMeanXY[0]+meanAdjustXY[0]), round(bestMeanXY[1]+meanAdjustXY[1]), 0]

    // let bestInterZ = getAllIntersections(flipXZ(transform(info, mean, bestVel)))
    // let bestMeanZ = meanXYZ(bestInter)
    // bestInterZ = getAllIntersections(flipXZ(transform(info, [mean[0], mean[1], round(bestMeanZ[0])], bestVel)))
    // let meanAdjustZ = meanXYZ(bestInterZ)

    // mean[2] = round(bestMeanZ[0]+meanAdjustZ[0])

    // bestInter = getAllIntersections(transform(info, mean, bestVel))
    let bestDev = deviation(bestInter)

    console.log('--')
    console.log('velocity', bestVel, 'mean', bestMeanXY, 'deviation', bestDev)

    console.log('total', bestMeanXY[0] + bestMeanXY[1] + bestMeanXY[2])
}

// console.log(partA(test, 7, 27))
// console.log(partA(input, 200000000000000, 400000000000000))
// console.log('--')
// console.log(partB(test))
console.log(partB(input))
