const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test20.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input20.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => ({ name: x.before(' -> '), list: x.after(' -> ').split(', ')}))
    let map = {}

    for (l of lines) {
        let type = ''
        let name = l.name
        if (name[0] == '%' || name[0] == '&') {
            type = name[0]
            name = name.substr(1)
        }
        map[name] = {name, type, list: l.list}
    }
    return map
}

test = parse(test)
input = parse(input)

function step(info, state, i) {
    let count = [0, 0, 0]

    let q = [ {from: 'button', to: 'broadcaster', val: 0} ]
    while (q.length > 0) {
        let signal = q.shift()
        count[signal.val] = count[signal.val] + 1
        // console.log(signal)

        if (signal.to == 'broadcaster') {
            for (target of info['broadcaster'].list) {
                q.push({from: 'broadcaster', to: target, val: signal.val})
            }
        } else if (signal.to == 'output') {
            console.log('>>>>output', signal)
        } else if (info[signal.to] && info[signal.to].type == '%') {
            // Flip flop
            // if input is 1, NOOP
            // if input is 0, flip state (initally 0) and send
            if (signal.val == 0) {
                state[signal.to] = state[signal.to] ? 0 : 1
                for (target of info[signal.to].list) {
                    let newVal = state[signal.to]
                    q.push( {from: signal.to, to: target, val: newVal} )
                }
            }
        } else if (info[signal.to] && info[signal.to].type == '&') {
            // Conjunction 
            // Remember this input
            // If all inputs for all known connections were 1, send a 0
            // Else send a 1
            state[signal.to].set(signal.from, signal.val)
            let allHigh = true

            for (let v of state[signal.to].values()) {
                if (!v) allHigh = false
            }

            let newVal = allHigh ? 0 : 1
            for (target of info[signal.to].list) {
                q.push( {from: signal.to, to: target, val: newVal } )
                if (target == 'bb' && newVal == 1) {
                    console.log(i+1, signal.to, target, newVal)
                }
            }
        } else if (signal.to == 'rx') {
            // console.log('got a', signal.val, 'signal to', signal.to)
            if (signal.val == 0) {
                count[2] = count[2] + 1
            }
        } else {
            console.log('got a', signal.val, 'signal to', signal.to)
        }
    }
    return count
}

function makeDefaultState(info) {
    let state = {}

    for (let key in info) {
        let {name, type, list} = info[key]
        if (type == '%') {
            state[name] = 0
        } else if (type == '&') {
            state[name] = new Map()
        }
    }

    for (let key in info) {
        let {name, type, list} = info[key]
        for (target of list) {
            if (info[target] && info[target].type == '&') {
                state[target].set(name, 0)
            }
        }
    }
    return state
}

function partA(info) {
    let state = makeDefaultState(info) 
    
    let count = [0, 0]
    for (i=0; i < 1000; i++) {
        let c = step(info, state, i)   
        count[0] = count[0] + c[0]
        count[1] = count[1] + c[1]
    }

    console.log(count)
    console.log(count[0] * count[1])
}

function printInfo(info) {
    for (let key in info) {
        if (info[key].type != '%' && info[key].type != '&') {
            console.log(key, '->', info[key].list)
        }
    }

    for (let key in info) {
        if (info[key].type == '%') {
            console.log(info[key].type, key, '->', info[key].list)
        }
    }

    console.log()

    for (let key in info) {
        if (info[key].type == '&') {
            console.log(info[key].type, key, '->', info[key].list)
        }
    }
}

function printState(state, keys = undefined) {
    if (!keys) {
        keys = Object.keys(state)
    }

    for (let key of keys) {
        if (typeof state[key] == 'number') {
            console.log(key + ':', state[key])
        }
    }

    for (let key of keys) {
        if (typeof state[key] != 'number') {
            console.log(key + ':', state[key])
        }
    }
}

function partB(info) {
    let state = makeDefaultState(info) 

    // printInfo(info)
    // printState(state)

    let i=0    
    for (i=0; i < 16000; i++) {
        let c = step(info, state, i)
        // printState(state, [ 'fr', 'zm', 'vr', 'br', 'px', 'nl', 'hz', 'vg', 'bs', 'xj', 'vt', 'ts', 'ms'])
        if (c[2] == 1) break
        if (i%100000 == 0) console.log(i, 'rx:', c[2])

        // printState(state)
    }

    // console.log('found it!!', i+1)
}

// console.log(partA(test))
// console.log(partA(input))
console.log('--')
// console.log(partB(test))
console.log(partB(input))
