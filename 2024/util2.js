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

class Grid {
    storage = [[]]

    constructor (h, w, c=null) {
        if (typeof h == 'string') {
            let str = h
            this.storage = str.split('\n').map(x => x.split(''))
        } else if (Array.isArray(h)) {
            this.storage = h
        } else {
            this.storage = []
            for (let i=0; i < h; i++) {
                this.storage.push(Array(w).fill(c))
            }
        }
    }

    h() {
        return this.storage.length
    }

    w() {
        return this.storage[0].length
    }

    toString() {
        return this.storage.map(x => x.join('')).join('\n')
    }

    // Print [['a','b','c'], ['d','e','f']] => "abc\ndef"
    // Any falsy values (except the number zero) will be turned into dots.
    print(alsoZero=false) {
        console.log(this.storage.map(x => x.map(
            y => ((y === 0 && alsoZero) || !y) ? '.' : y
            ).join('')).join('\n') + '\n')
            
    }

    // Fill a grid with a character
    fill(c) {
        this.storage = []        
        for (let i=0; i < this.h(); i++) {
            this.storage.push(Array(this.w()).fill(c))
        }
    }

    // Copy a grid
    copy() {
        let s = []
        for (let i=0; i < this.h(); i++) {
            s.push(this.storage[i].concat())
        }
        return new Grid(s)
    }

    // Make an empty grid or strGrid that is the same size
    copyEmpty(c=null) {
        return new Grid(this.h(), this.w(), c)
    }

    // Make a transposed copy of a grid or strGrid
    transpose() {
        let g = new Grid(this.w(), this.h())
        for (let [i, j] of this.indexes()) {
            g.setAt(j, i, this.getAt(i, j))
        }
        return g
    }

    // Get an element from the grid. 
    // if out of bounds, will return undefind.
    getAt(i, j) {
        if (i < 0 || i >= this.h() || j < 0 || j >= this.w()) return undefined
        return this.storage[i][j]
    }

    // Set a space in the grid to c
    setAt(i, j, c) {
        if (i < 0 || i >= this.h() || j < 0 || j >= this.w()) {
            // console.log('tried to write at position', i, j, 'when grid is only', this.h(), this.w())
        }
        this.storage[i][j] = c
    }

    col(j) {
        let r = []
        for (let i=0; i < this.h(); i++) {
            r.push(this.getAt(i, j))
        }
        return r
    }

    row(i) {
        let r = []
        for (let i=j; i < this.w(); j++) {
            r.push(this.getAt(i, j))
        }
        return r
    }

    equals(g) {
        if (this.w() != g.w()) return false
        if (this.h() != g.h()) return false

        for (let [i, j] of this.indexes()) {
            if (this.getAt(i, j) != g.getAt(i, j)) return false
        }
        return true
    }

    // signature: f(value, i, j, originalGrid) => boolean
    find(c) {
        let f = (typeof c == 'function') ? c : (v, i, j, g) => { return v == c }

        for (let [i, j] of this.indexes()) {
            let v = this.getAt(i, j)
            if (f(v,i,j,this)) return [i, j, v]
        }

        return null
    }

    // signature: f(value, i, j, originalGrid) => boolean
    findAll(c) {
        let result = []
        let f = (typeof c == 'function') ? c : (v, i, j, g) => { return v == c }
        for (let [i, j] of this.indexes()) {
            let v = this.getAt(i, j)
            if (f(v,i,j,this)) result.push([i, j, v])
        }
        return result
    }

    // Returns a one dimensional list of indexes (+ value)
    // => [ [0, 0, val1], [0, 1, val2], .... [n-1, n-1, valn] ]
    indexes() {
        let r = []
        for (let i=0; i < this.h(); i++) {
            for (let j=0; j < this.w(); j++) {
                r.push([i, j])
            }
        }
        return r
    }

    indexesAndValues() {
        let r = []
        for (let i=0; i < this.h(); i++) {
            for (let j=0; j < this.w(); j++) {
                r.push([i, j, this.getAt(i, j)])
            }
        }
        return r
    }

    // Calls a function for every element in the grid.
    // signature: f(value, i, j, originalGrid)
    forEach(f) {
        for (let i=0; i < this.h(); i++) {
            for (let j=0; j < this.w(); j++) {
                f(this.getAt(i,j), i, j, this)
            }
        }
    }

    // Maps a function onto every element of the grid, and returns a new grid.
    // signature: f(value, i, j, originalGrid) => newValue
    map(f) {
        let result = this.copyEmpty()
        this.forEach((v,i,j,g) => result.setAt(i, j, f(v,i,j,g)))
        return result
    }

    // Checks to see if a function returns true for every element of the grid
    // signature: f(value, i, j, originalGrid) => boolean
    every(f) {
        return this.count(f) == this.h() * this.w()
    }

    // Counts how many times a function returns true
    // Note: this is equivalent to some()
    // signature: f(value, i, j, originalGrid) => boolean
    count(f) {
        let result = 0
        this.forEach((v,i,j,g) => { if (f(v,i,j,g)) result++ })
        return result
    }

    // Returns the neighbors that are within the grid (including diagonals)
    // => [ [i-1, j-1, val1], [i, j-1, val2], .... [i+1, j+1, valnn] ]
    neighbors(i, j, diagonalOk = true) {
        let r = []
        for (let ii = i-1; ii <= i+1; ii++) {
            for (let jj = j-1; jj <= j+1; jj++) {
                if (ii >= 0 && jj >= 0 && ii < this.h() && jj < this.w() && !(i == ii && j == jj)) {
                    if (diagonalOk || ii == i || jj == j) {
                        r.push([ii, jj, this.getAt(ii, jj)])
                    }
                }
            }
        }
        return r
    }

    // Returns the values at the neighboring positions
    // => [ val1, val2, .... valnn ]
    neighborVals(i, j) {
        return this.neighbors(i, j).map(x => x[2])
    }
}

Array.prototype.arrEquals = function (arr) {
    if (this.length != arr.length) return false
    for (let i=0; i < this.length; i++) {
        if (this[i] != arr[i]) return false
    }        
    return true
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
    Grid,
    toNumber,
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
