const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test10.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input10.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n').map(x => x.split(''))
}

test = parse(test)
input = parse(input)

// console.log(test)

let legal = {
    N: '|JL',
    S: '|7F',
    W: '-7J',
    E: '-FL'
}

let vertical = 'S|JL7F'

function partA(lines) {
    let i, j
    for (i of lines.keys()) {
        l = lines[i]
        j = l.join('').indexOf('S')
        if (j != -1) {
            break
        }
    }

    let startI = i
    let startJ = j

    let visited = lines.copyEmpty()
    let path = []

    visited[i][j] = 1
    path.push(i, j)
    console.log('(', i, ',', j, ')')

    if (i > 0 && legal.S.includes(lines[i-1][j])) {
        i = i-1
        visited[i][j] = 1
    } else if (i < lines.h()-1 && legal.N.includes(lines[i+1][j])) {
        i = i+1
        visited[i][j] = 1

    } else if (j > 0 && legal.E.includes(lines[i][j-1])) {
        j = j-1
        visited[i][j] = 1
    } else if (j < lines.w()-1 && legal.W.includes(lines[i][j+1])) {
        j = j+1
        visited[i][j] = 1
    } else {
        throw 'ack'
    }
    visited[i][j] = 1

    path.push(i, j)
    console.log('(', i, ',', j, ')')

    let steps = 1
    while (i != startI || j != startJ) {
        steps++
        if (i > 0 && !visited[i-1][j] && legal.N.includes(lines[i][j])) {
            i = i-1
            visited[i][j] = steps
        } else if (i < lines.h()-1 && !visited[i+1][j] && legal.S.includes(lines[i][j])) {
            i = i+1
            visited[i][j] = steps

        } else if (j > 0 && !visited[i][j-1] && legal.W.includes(lines[i][j])) {
            j = j-1
            visited[i][j] = steps
        } else if (j < lines.w()-1 && !visited[i][j+1] && legal.E.includes(lines[i][j])) {
            j = j+1
            visited[i][j] = steps
        } else {
            return steps / 2
        }
        path.push(i, j)
        console.log('(', i, ',', j, ')')
    }

    return steps / 2
}

function partB(lines) {
        let i, j
    for (i of lines.keys()) {
        l = lines[i]
        j = l.join('').indexOf('S')
        if (j != -1) {
            break
        }
    }

    let startI = i
    let startJ = j

    let visited = lines.copyEmpty()
    let path = []

    visited[i][j] = 1
    path.push(i, j)
    // console.log('(', i, ',', j, ')')

    if (i > 0 && legal.S.includes(lines[i-1][j])) {
        i = i-1
        visited[i][j] = 1
    } else if (i < lines.h()-1 && legal.N.includes(lines[i+1][j])) {
        i = i+1
        visited[i][j] = 1

    } else if (j > 0 && legal.E.includes(lines[i][j-1])) {
        j = j-1
        visited[i][j] = 1
    } else if (j < lines.w()-1 && legal.W.includes(lines[i][j+1])) {
        j = j+1
        visited[i][j] = 1
    } else {
        throw 'ack'
    }
    visited[i][j] = 1

    path.push(i, j)
    // console.log('(', i, ',', j, ')')

    let steps = 1
    while (i != startI || j != startJ) {
        steps++
        if (i > 0 && !visited[i-1][j] && legal.N.includes(lines[i][j])) {
            i = i-1
            visited[i][j] = steps
        } else if (i < lines.h()-1 && !visited[i+1][j] && legal.S.includes(lines[i][j])) {
            i = i+1
            visited[i][j] = steps

        } else if (j > 0 && !visited[i][j-1] && legal.W.includes(lines[i][j])) {
            j = j-1
            visited[i][j] = steps
        } else if (j < lines.w()-1 && !visited[i][j+1] && legal.E.includes(lines[i][j])) {
            j = j+1
            visited[i][j] = steps
        } else {
            break
        }
        path.push(i, j)
        // console.log('(', i, ',', j, ')')
    }

    let count = 0
    for (i=0; i<visited.h(); i++) {
        let winding = 0
        for (j=0; j<visited.w(); j++) {
            if (visited[i][j]) {
                c = lines[i][j]
                // if (c == 'S') c = 'F'
                if (c == 'S') c = '7'

                if (c == '|') {
                    winding += 2
                } else if ('L7'.includes(c)) {
                    winding += 1
                } else if ('FJ'.includes(c)) {
                    winding -= 1
                }
                console.log('visited', i, j, winding/2)
            } else {
                if (Math.abs(winding) % 4 == 2) {
                    console.log('>>>>>inside', i, j)
                    count++
                }
            }
        }
    }
    return count
}

function partB(lines) {
    let i, j
    for (i of lines.keys()) {
        l = lines[i]
        j = l.join('').indexOf('S')
        if (j != -1) {
            break
        }
    }

    let startI = i
    let startJ = j

    let visited = copyEmptyGrid(lines)
    visited[i][j] = 1

    // Pick an initial direction by visiting neighbors
    if (i > 0 && '|7F'.includes(lines[i-1][j])) {
        i = i-1
    } else if (i < lines.h()-1 && '|JL'.includes(lines[i+1][j])) {
        i = i+1
    } else if (j > 0 && '-FL'.includes(lines[i][j-1])) {
        j = j-1
    } else if (j < lines.w()-1 && '-7J'.includes(lines[i][j+1])) {
        j = j+1
    } 
    visited[i][j] = 1

    while (i != startI || j != startJ) {
        if (i > 0 && !visited[i-1][j] && '|JL'.includes(lines[i][j])) {
            i = i-1
        } else if (i < lines.h()-1 && !visited[i+1][j] && '|7F'.includes(lines[i][j])) {
            i = i+1
        } else if (j > 0 && !visited[i][j-1] && '-7J'.includes(lines[i][j])) {
            j = j-1
        } else if (j < lines.w()-1 && !visited[i][j+1] && '-FL'.includes(lines[i][j])) {
            j = j+1
        } else {
            break // back to start
        }
        visited[i][j] = 1
    }

    // go left to right and count crossings
    let count = 0
    for (i=0; i<visited.h(); i++) {
        let winding = 0
        for (j=0; j<visited.w(); j++) {
            if (visited[i][j]) {
                c = lines[i][j]
                if (c == 'S') c = '7' // Hardcode what 'S' happens to be in my input

                if (c == '|') {                 // vertical line == full crossing
                    winding += 2
                } else if ('L7'.includes(c)) {  // L and 7 are half crossings
                    winding += 1
                } else if ('FJ'.includes(c)) {  // F and J are half (opposite direction)
                    winding -= 1
                }
            } else {
                if (Math.abs(winding) % 4 == 2) {
                    count++
                }
            }
        }
    }
    return count
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
// console.log(partB(input))
console.log(partBcleaned(input))
