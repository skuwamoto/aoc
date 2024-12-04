// "abc:def".before(":") => "abc"
function before(s, prefix) {
    let i = s.indexOf(prefix) 
    if (i == -1) throw (new Error('separator not found', prefix))
    return s.substr(0, i)
}
String.prototype.before = function(prefix) { return before(this, prefix) }

// "abc:def".after(":") => "def"
function after(s, suffix) {
    let i = s.indexOf(suffix) 
    if (i == -1) throw (new Error('separator not found', prefix))
    return s.substr(i+suffix.length)
}
String.prototype.after = function(prefix) { return after(this, prefix) }

// "abc:def:ghi".between(":",":") => "def"
function between(s, prefix, suffix) {
    return s.after(prefix).before(suffix)
}
String.prototype.between = function(prefix, suffix) { return between(this, prefix, suffix) }

// "blue 3, green 4, red 5" => {blue: 3, green: 4, red: 5}
function lsplitMap(s, inner = ' ', outer = ',', formatter = String) {
    let result = {}
    for (let entry of s.split(outer)) {
        let [left, right] = entry.trim().split(inner)
        result[left.trim()] = formatter(right.trim())
    }
    return result
}
String.prototype.lsplitMap = function(inner = ' ', outer = ',', formatter = String) { return lsplitMap(this, inner, outer, formatter) }

// "3 blue, 4 green, 5 red" => {blue: 3, green: 4, red: 5}
function rsplitMap(s, inner = ' ', outer = ', ', formatter = String) {
    let result = {}
    for (let entry of s.split(outer)) {
        let [left, right] = entry.trim().split(inner)
        result[right.trim()] = formatter(left.trim())
    }
    return result
}
String.prototype.rsplitMap = function(inner = ' ', outer = ',', formatter = String) { return rsplitMap(this, inner, outer, formatter) }

// "3 ".toNumber() => 3
function toNumber(s) {
    return Number(s.trim())
}
String.prototype.toNumber = function() { return toNumber(this) }

// Hacky way to see if this looks like an array of arrays
Array.prototype.isGrid = function() { return this.length && Array.isArray(this[0]) }

// Height
Array.prototype.h = function() { return this.length }

// Width
Array.prototype.w = function() { return this[0].length }

String.prototype.stringToGrid = function() {
    return this.split('\n').map(x => x.split(''))
}

Array.prototype.gridToString = function() {
    return this.map(x => x.join('')).join('\n')
}

// Makes a grid of size h, w
function newGrid(h, w, c=null) {
    if (c === null) { c = 0 }

    let g = []
    for (let i=0; i < h; i++) {
        g.push(Array(w).fill(c))
    }
    return g
}

// Makes a strGrid of size h, w
function newStrGrid(h, w, c=null) {
    if (c === null) { c = '.' }

    let g = []
    for (let i=0; i < h; i++) {
        g.push(Array(w).fill(c).join(''))
    }
    return g
}

// Erase a grid or strGrid.
// For grids, the items default to the number 0. For strGrid, defaults to dots.
Array.prototype.erase = function(c=null) {
    let isGrid = this.isGrid()

    if (c === null) { c = (isGrid) ? 0 : '.' }
    let w = this.w()
    let h = this.h()

    this.length = 0
    for (let i=0; i < h; i++) {
        this.push(Array(w).fill(c))
        if (!isGrid) {
            this[i] = this[i].join('')
        }
    }
    return this
}

// Copy a grid or strGrid
Array.prototype.copy = function() {
    let isGrid = this.isGrid()
    let g = []

    for (let i=0; i < this.h(); i++) {
        if (isGrid) {
            g.push(this[i].concat())
        } else {
            g.push(this[i])
        }
    }
    return g
}

// Make an empty grid or strGrid that is the same size
Array.prototype.copyEmpty = function(c=null) {
    if (this.isGrid()) {
        return newGrid(this.h(), this.w(), c)
    } else {
        return newStrGrid(this.h(), this.w(), c)
    }
}

// Make a transposed copy of a grid or strGrid
Array.prototype.transpose = function() {
    let g
    if (this.isGrid()) {
        g = newGrid(this.w(), this.h())
    } else {
        g = newStrGrid(this.w(), this.h())
    }

    for (let i=0; i < this.h(); i++) {
        for (let j=0; j < this.w(); j++) {
            g.setAt(j, i, this[i][j])
        }
    }
    return g
}


// Get an element from the grid. 
// if out of bounds, will return undefind.
Array.prototype.getAt = function(i, j, c) {
    return (this[i] === undefined) ? undefined : this[i][j]
}

// Set a space in the grid to c
Array.prototype.setAt = function(i, j, c) {
    if (this.isGrid()) {
        this[i][j] = c
    } else {
        let row = this[i].split('')
        row[j] = c
        this[i] = row.join('')
    }
}

Array.prototype.col = function (j) {
    let r = []
    for (let i=0; i < this.h(); i++) {
        r.push(this[i][j])
    }
    return r
}

Array.prototype.colStr = function (j) { return this.col(j).join('') }

Array.prototype.row = function (i) {
    return this.isGrid() ? this[i].concat() : this[i].split('')
}

Array.prototype.rowStr = function (i) {
    return this.isGrid() ? this[i].join('') : this[i]
}

Array.prototype.arrEquals = function (arr) {
    if (this.length != arr.length) return false
    for (let i=0; i < this.length; i++) {
        if (this[i] != arr[i]) return false
    }        
    return true
}

Array.prototype.gridEquals = function (grid) {
    if (this.w() != grid.w()) return false
    if (this.h() != grid.h()) return false

    for (let i=0; i < this.h(); i++) {
        for (let j=0; j < this.w(); j++) {
            if (this[i][j] != grid[i][j]) return false
        }
    }        
    return true
}


// Print [['a','b','c'], ['d','e','f']] => "abc\ndef"
// Any falsy values (except the number zero) will be turned into dots.
function print(grid, alsoZero=false) {
    if (grid.isGrid()) {
        console.log(grid.map(x => x.map(
            y => ((y === 0 && alsoZero) || !y) ? '.' : y
            ).join('')).join('\n') + '\n')
            
    } else {
        console.log(grid.join('\n') + '\n')
    }
}
Array.prototype.print = function() { print(this) }

// Returns a one dimensional list of indexes
// => [ [0, 0], [0, 1], .... [n-1, n-1] ]
Array.prototype.indexes = function() {
    let r = []
    for (let i=0; i < this.h(); i++) {
        for (let j=0; j < this.w(); j++) {
            r.push([i, j])
        }
    }
    return r
}

// Returns a one dimensional list of indexes (+ value)
// => [ [0, 0, val1], [0, 1, val2], .... [n-1, n-1, valn] ]
Array.prototype.indexesAndValues = function() {
    let r = []
    for (let i=0; i < this.h(); i++) {
        for (let j=0; j < this.w(); j++) {
            r.push([i, j, this[i][j]])
        }
    }
    return r
}

// maps a function onto every element of the grid
Array.prototype.mapGrid = function(f) {
    let result = this.copyEmpty()
    for (let i=0; i < this.h(); i++) {
        for (let j=0; j < this.w(); j++) {
            result[i][j] = f(this[i][j])
        }
    }
    return result
}

// Returns the neighbors that are within the grid (including diagonals)
// => [ [i-1, j-1, val1], [i, j-1, val2], .... [i+1, j+1, valnn] ]
Array.prototype.neighbors = function(i, j, diagonalOk = true) {
    let r = []
    for (let ii = i-1; ii <= i+1; ii++) {
        for (let jj = j-1; jj <= j+1; jj++) {
            if (ii >= 0 && jj >= 0 && ii < this.h() && jj < this.w() && !(i == ii && j == jj)) {
                if (diagonalOk || ii == i || jj == j) {
                    r.push([ii, jj, this[ii][jj]])
                }
            }
        }
    }
    return r
}

// Returns the values at the neighboring positions
// => [ val1, val2, .... valnn ]
Array.prototype.neighborVals = function(i, j) {
    return this.neighbors(i, j).map(x => x[2])
}

// Simple sum
function sum(a) { return a.reduce((acc, item) => acc + item, 0) }
Array.prototype.sum = function () { return sum(this) }

//  sort([10,3,2]) => [10, 2, 3] (does not make a copy)
// nsort([10,3,2]) => [2, 3, 10] (does not make a copy)
// rsort([10,3,2]) => [10, 3, 2] (does not make a copy)

function sort(a) { a.sort(); return a }
function nsort(a) { a.sort((a,b) => a-b); return a }
function rsort(a) { a.sort((a,b) => b-a); return a }

Array.prototype.nsort = function() { return nsort(this) }
Array.prototype.rsort = function() { return rsort(this) }

//  => [c, c, c, c]
function newArr(n, c=null) {
    c = (c === null) ? 0 : c
    return Array(n).fill(c)
}

// => "cccc"
function newStr(n, c=null) {
    c = (c === null) ? '.' : c
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
        let rest = permuteArr(arr.slice(0, i).concat(arr.slice(i+1)))
        for (let r of rest) {
            r.unshift(c)
            result.push(r)
        }
    }

    return result
}
Array.prototype.permute = function() { return permuteArr(this) }

// "123" => ["123", "132", "213", ...]
function permuteStr(str) {
    return str.split('').permute().map(x => x.join(''))
}
String.prototype.permute = function() { return permuteStr(this) }

// [1, 2, 3] => [ [], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3] ]
function powerSetArr(arr) {
    if (arr.length == 0) {
        return [[]]
    }

    let result = []
    let first = arr[0]
    let rest = powerSetArr(arr.slice(1))

    result = result.concat(rest)
    result = result.concat(rest.map(x => [first].concat(x) ))

    return result
}
Array.prototype.powerSet = function() { return powerSetArr(this) }

// "abc" => [ "", "a", "b", "c", "ab", "ac", "bc", "abc" ]
function powerSetStr(str) {
    return str.split('').powerSet().map(x => x.join(''))
}
String.prototype.powerSet = function() { return powerSetStr(this) }

// ['a', 'b', 'a'] => ['a', 'b']
function unique(arr) {
    return [...new Set(arr)];
}
Array.prototype.unique = function() { return unique(this) }

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

function lcm2(a, b) {
    return a * b / gcd2(a, b)
}

function gcd2(a, b) {
  if (!b) {
    return a;
  }

  return gcd2(b, a % b);
}

function gcd(arr) {
    if (Array.isArray(arr)) {
        return gcd(...arr)
    }

    let result = arguments[0]
    for (let a of arguments) {
        result = gcd2(result, a)
    }
    return result
}

function lcm(arr) {
    if (Array.isArray(arr)) {
        return lcm(...arr)
    }
    let result = 1
    for (let a of arguments) {
        result = lcm2(result, a)
    }
    return result
}

function trimChar(str, c) { 
    for (let i=0; i < str.length && str[i] == c; i++) {
    }
    for (let j=str.length-1; j > i && str[j] == c; j--) {
    }
    return str.substring(i, j+1)
}
String.prototype.trimChar = function(c) { return trimC(this, c) }

String.prototype.replaceAt = function(i, c) { 
    let arr = this.split('')
    arr[i] = c
    return arr.join('')
}

Array.prototype.minIndex = function (compare = (a,b) => a-b) {
    if (this.length == 0) return undefined
    let best = 0
    for (let i=1; i < this.length; i++) {
        if (compare(this[i], this[best]) < 0) {
            best = i
        }
    }
    return i
}

Array.prototype.maxIndex = function (compare = (a,b) => a-b) {
    if (this.length == 0) return undefined
    let best = 0
    for (let i=1; i < this.length; i++) {
        if (compare(this[i], this[best]) > 0) {
            best = i
        }
    }
    return i
}

Array.prototype.min = function (compare = (a,b) => a-b) {
    return this[this.minIndex(compare)]
}

Array.prototype.max = function (compare = (a,b) => a-b) {
    return this[this.maxIndex(compare)]
}

Array.prototype.popAt = function (i) {
    let r = this[i]
    this.splice(i, 1)
    return r
}

class PriorityQueue {
    constructor(comparator = (a, b) => a > b) {
        this._heap = [];
        this._comparator = comparator;
    }
    size() {
        return this._heap.length;
    }
    isEmpty() {
        return this.size() == 0;
    }
    peek() {
        if (this.isEmpty()) return undefined
        return this._heap[this._top];
    }
    push(...values) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }
    pop() {
        if (this.isEmpty()) return undefined

        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > this._top) {
            this._swap(this._top, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }
    replace(value) {
        const replacedValue = this.peek();
        this._heap[this._top] = value;
        this._siftDown();
        return replacedValue;
    }
    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
    _siftUp() {
        let node = this.size() - 1;
        while (node > this._top && this._greater(node, this._parent(node))) {
            this._swap(node, this._parent(node));
            node = this._parent(node);
        }
    }
    _siftDown() {
        let node = this._top;
        while ((this._left(node) < this.size() && this._greater(this._left(node), node)) ||
               (this._right(node) < this.size() && this._greater(this._right(node), node))
        ) {
            let maxChild = (this._right(node) < this.size() && this._greater(this._right(node), this._left(node))) ? this._right(node) : this._left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }

    _top = 0;
    _parent(i) { 
        return ((i + 1) >>> 1) - 1 
    }
    _left(i) { 
        return (i << 1) + 1 
    }
    _right(i) { 
        return (i + 1) << 1 
    }
}

module.exports = { 
    toNumber,
    newGrid,
    newStrGrid,
    print, 
    sum, 
    newArr, 
    newStr, 
    unique, 
    intersect, 
    union,
    lcm2,
    gcd2,
    lcm, 
    gcd,
    PriorityQueue
}
