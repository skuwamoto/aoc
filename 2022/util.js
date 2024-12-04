// Print [['a','b','c'], ['d','e','f']] => "abc\ndef"
function print(lines) {
    console.log(lines.map(x => x.join('')).join('\n') + '\n')
}

// Print [['0','0','X'], ['X','0','0']] => "..X\nX.."
function printDot(lines, c) {
    console.log(lines.map(x => x.join('')).join('\n').replaceAll(c, '.') + '\n')
}

// Simpler forms
Array.prototype.sum = function () { return this.reduce((acc, item) => acc + item, 0) }
function sum(a) { return a.reduce((acc, item) => acc + item, 0) }

// sort([1,3,2]) => [1,2,3] (does not make a copy)
// rsort([1,3,2]) => [3,2,1] (does not make a copy)
function sort(a) { a.sort(); return a }
function rsort(a) { a.sort((a,b) => b-a); return a }

//  => [c, c, c, c]
function fillArr(c, n) {
    return Array(n).fill(c)
}

// => "cccc"
function fillStr(c, n) {
    return Array(n).fill(c).join('')
}

// [1,2,3] => [[1,2,3], [1,3,2], [2,1,3], ...]
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

// "123" => ["123", "132", "213", ...]
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

// ['a', 'b', 'a'] => ['a', 'b']
function unique(arr) {
    return [...new Set(arr)];
}

// ['a', 'b'] + ['b', 'c'] => ['b']
function intersect(arr1, arr2) {
    let result = [];
    for (let k of arr1) {
        if (arr2.includes(k)) {
            result.push(k)
        }
    }
    return result;
}

// ['a', 'b'] + ['b', 'c'] => ['a', 'b', 'c']
function union(arr1, arr2) {
    return unique(arr1.concat(arr2))
}


function unionMaps(m1, m2) {
    let result = Object.clone(m1)
    for (let k in m2) {
        result[k] = 1
    }
    return result
}

function intersectMaps(m1, m2) {
    let result = Object.clone(m1)
    for (let k in m1) {
        if (!m2[k]) delete result[k]
    }
    return result
}

function unionArrays(a1, a2) {
    let result = Object.clone(a1)
    for (let v of a2) {
        if (result.indexOf(v) == -1) {
            result.push(v)
        }
    }

    return result
}

function intersectArrays(a1, a2) {
    let result = []
    for (let v of a1) {
        if (a2.indexOf(v) != -1) {
            result.push(v)
        }
    }

    return result
}

function strMap(s) {
    let result = {}
    for (let i=0; i<s.length; i++) 
        result[s[i]] = 1
    return result
}

function arrayMap(s) {
    let result = {}
    for (let i=0; i<s.length; i++) 
        result[s[i]] = 1
    return result
}

