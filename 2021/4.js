const fs = require('fs');

let test = fs.readFileSync('./test4.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input4.txt', {encoding:'utf8', flag:'r'});

test = test.split('\n\n')
testNums = test.shift().split(',').map(x => Number(x))

input = input.split('\n\n')
inputNums = input.shift().split(',').map(x => Number(x))

function mark(n, boards) {
    for (let k=0; k<boards.length; k++) {
        let b = boards[k]
        for (let i=0; i<5; i++) {
            for (let j=0; j<5; j++) {
                if (b[i][j] == n) b[i][j] = -1
            }
        }
    }
}

function check(n, boards) {
    for (let k=0; k<boards.length; k++) {
        let b = boards[k]
        // check horizontals
        for (let i=0; i<5; i++) {
            if (b[i][0] == -1 && b[i][1] == -1 && b[i][2] == -1 && b[i][3] == -1 && b[i][4] == -1)
                return k;
        }
        for (let j=0; j<5; j++) {
            if (b[0][j] == -1 && b[1][j] == -1 && b[2][j] == -1 && b[3][j] == -1 && b[4][j] == -1)
                return k;
        }
    }
    return -1
}

function score(n, board) {
    let sum = 0
    for (let i=0; i<5; i++) {
        for (let j=0; j<5; j++) {
            if (board[i][j] != -1) sum += board[i][j]
        }
    }

    return n * sum
}

function partA(nums, boards) {
    let boardsA = boards.map(b => b.split('\n').map(line => line.trim().split(/\s+/).map(x => Number(x))))

    for (let n of nums) {
        mark(n, boardsA)
        let foundIndex = check(n, boardsA)
        if (foundIndex != -1) return score(n, boardsA[foundIndex])
    }

    return -1 // error
}

function partB(nums, boards) {
    let lastScore = -1

    let boardsB = boards.map(b => b.split('\n').map(line => line.trim().split(/\s+/).map(x => Number(x))))
    for (let n of nums) {
        mark(n, boardsB)

        while(true) {
            let foundIndex = check(n, boardsB)
            if (foundIndex != -1) {
                lastScore = score(n, boardsB[foundIndex])
                boardsB.splice(foundIndex, 1)
            } else {
                break
            }
        }
    }

    return lastScore
}

console.log(partA(testNums, test))
console.log(partA(inputNums, input))
console.log('--')
console.log(partB(testNums, test))
console.log(partB(inputNums, input))
