function print(lines) {
    console.log(lines.map(x => x.join('')).join('\n') + '\n')
}

function printDot(lines, c) {
    console.log(lines.map(x => x.join('')).join('\n').replaceAll(c, '.') + '\n')
}

function sum(arr) { return arr.reduce((a,b) => a+b)}

function fillArr(c, n) {
    return Array(n).fill(c)
}

function fillStr(c, n) {
    let result = ''
    for (let i=0; i < n; i++) { 
        result += c 
    }
    return result    
}

function permuteArr(arr) { 
    if (arr.length == 1) {
        return [arr]
    }

    let result = []
    for (let i=0; i < arr.length; i++) {
        let c = arr[i]
        let rest = permuteStr(arr.splice(0, i).concat(arr.splice(i+1)))
        rest.forEach(r => result.push(c + r))
    }

    return result
}

function permuteStr(str) {
    if (str.length == 1) {
        return [str]
    }

    let result = []
    for (let i=0; i < str.length; i++) {
        let c = str[i]
        let rest = permuteStr(str.slice(0, i) + str.slice(i+1))
        rest.forEach(r => result.push(c + r))
    }

    return result
}

