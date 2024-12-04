const NEW = -1
const ADD = 1
const MULTIPLY = 2
const INPUT = 3
const OUTPUT = 4
const JUMP_IF_TRUE = 5
const JUMP_IF_FALSE = 6
const LESS_THAN = 7
const EQUALS = 8
const RELATIVE_BASE = 9
const END = 99

const instr = {
    1: { name: 'ADD',           shortName: 'ADD', argNum: 3 },
    2: { name: 'MULTIPLY',      shortName: 'MUL', argNum: 3 },
    3: { name: 'INPUT',         shortName: 'INP', argNum: 1 },
    4: { name: 'OUTPUT',        shortName: 'OUT', argNum: 1 },
    5: { name: 'JUMP_IF_TRUE',  shortName: 'IFT', argNum: 2 },
    6: { name: 'JUMP_IF_FALSE', shortName: 'IFF', argNum: 2 },
    7: { name: 'LESS_THAN',     shortName: 'LT ', argNum: 3 },
    8: { name: 'EQUALS',        shortName: 'EQ ', argNum: 3 },
    9: { name: 'RELATIVE_BASE', shortName: 'BAS', argNum: 1 },
    99:{ name: 'END',           shortName: 'END', argNum: 0 }
}

class Machine {
    name = "machine"
    code = []
    pc = 0
    relativeBase = 0
    input = []

    constructor(name, code) {
        this.name = name
        this.code = code.concat()
        this.pc = 0
        this.relativeBase = 0
    }

    _getVal(mode) {
        if (mode == '1') return Number(this.code[this.pc])
        return this.code[this._getAddr(mode)]
    }

    _getAddr(mode) {
        if (mode == '1') throw new Error('tried to get address for immediate mode argument')

        let addr = Number(this.code[this.pc])
        if (mode == '2') addr += this.relativeBase

        while (this.code.length <= addr+1 ) {
            this.code.push(0)        
        }

        return addr
    }

    _getNextOperation() {
        let op = String(this.code[this.pc])
        let modes = []

        // Strip all the modes out
        while (op.length > 2) {
            modes.push(op[0])
            op = op.substr(1)
        }
        op = Number(op)

        // Get the operand and increment the this.pc.
        let result = [op]
        this.pc++

        if (op == INPUT) {
            result.push(this._getAddr(modes.pop()))
            this.pc++
        }
        else if (op == OUTPUT || op == RELATIVE_BASE)
        {
            result.push(this._getVal(modes.pop()))
            this.pc++
        } 
        else if (op == ADD || op == MULTIPLY || op == LESS_THAN || op == EQUALS)
        {
            result.push(this._getVal(modes.pop()))
            this.pc++

            result.push(this._getVal(modes.pop()))
            this.pc++

            result.push(this._getAddr(modes.pop()))
            this.pc++
        } else if (op == JUMP_IF_TRUE || op == JUMP_IF_FALSE) {
            result.push(this._getVal(modes.pop()))
            this.pc++

            result.push(this._getVal(modes.pop()))
            this.pc++
        } 

        return result
    }

    addInput(input) {
        if (Array.isArray(input)) { 
            this.input.push(...input)
        } else {
            this.input.push(input)
        }
    }

    run() {
        while (true) {
            let oldPc = this.pc
            let [op, a1, a2, a3] = this._getNextOperation()
            if (this.debug) console.log('pc', oldPc, instr[op].name, a1 == undefined ? '' : a1, a2 == undefined ? '' : a2, a3 == undefined ? '' : a3, 'pc ->', this.pc)

            if (op == ADD) {
                this.code[a3] = a1 + a2
            } 
            else if (op == MULTIPLY) {
                this.code[a3] = a1 * a2
            } 
            else if (op == INPUT) {
                if (this.input.length) {
                    this.code[a1] = this.input.shift()
                } else {
                    this.pc -= 2 // Get ready to run this input again
                    return {op: op, opName: instr[op].name}
                }
                if (this.debug) console.log('>> input', this.code[a1])
            } 
            else if (op == OUTPUT) {
                if (this.debug) console.log('>> output', a1)
                return {op: op, opName: instr[op].name, result: Number(a1)}
            } 
            else if (op == JUMP_IF_TRUE) {
                if (a1 != 0) this.pc = a2
            } 
            else if (op == JUMP_IF_FALSE) {
                if (a1 == 0) this.pc = a2
            } 
            else if (op == LESS_THAN) {
                this.code[a3] = (a1 < a2) ? 1 : 0
            } 
            else if (op == EQUALS) {
                this.code[a3] = (a1 == a2) ? 1 : 0
            } 
            else if (op == RELATIVE_BASE) {
                this.relativeBase += a1
            }
            else if (op == END) {
                return {op: op, opName: instr[op].name}
            } else {
                console.log('error! pc=', oldPc, 'op=', op)
                throw new Error(op)
            }
        }
    }

    _getArgAsDebug(mode) {
        if (!mode) mode = 0
        if (mode == '0') return '[' + this.code[this.pc] + ']'
        if (mode == '1') return '' + this.code[this.pc]
        if (mode == '2') return '[base+' + this.code[this.pc]+']'
    }

    _getNextOperationAsDebug() {
        let op = String(this.code[this.pc])
        let modes = []

        // Strip all the modes out
        while (op.length > 2) {
            modes.push(op[0])
            op = op.substr(1)
        }
        op = Number(op)

        // Get the operand and increment the this.pc.
        let result = [op]
        this.pc++

        if (instr[op]) {
            for (let i=0; i < instr[op].argNum; i++) {
                result.push(this._getArgAsDebug(modes.pop()))
                this.pc++
            }
        }
        return result
    }

    disassemble() {
        let i = 0
        let s = ''

        let savePc = this.pc
        this.pc = 0

        while (i < this.code.length) {
            // 3 digit line num
            let num = i.toString()
            while (num.length < 4) {
                num = ' ' + num
            }
            
            // 10 digit raw op num
            let rawOp = this.code[i].toString()
            while (rawOp.length < 10) {
                rawOp = ' ' + rawOp
            }

            // modes and opname
            let desc = ''
            if (i == this.pc) {
                let [op, a1, a2, a3] = this._getNextOperationAsDebug()
                desc = (instr[op] ? instr[op].name : '???') + ' '

                if (op == ADD)              desc += a1 + ', ' + a2 + ' -> ' + a3
                if (op == MULTIPLY)         desc += a1 + ', ' + a2 + ' -> ' + a3
                if (op == INPUT)            desc += ' -> ' + a1
                if (op == OUTPUT)           desc += a1
                if (op == JUMP_IF_TRUE)     desc += a1 + ' -> ' + a2
                if (op == JUMP_IF_FALSE)    desc += a1 + ' -> ' + a2
                if (op == LESS_THAN)        desc += a1 + ' , ' + a2 + ' -> ' + a2
                if (op == EQUALS)           desc += a1 + ' , ' + a2 + ' -> ' + a2
                if (op == RELATIVE_BASE)    desc += a1
            }

            s += num + ': ' + rawOp + ' | ' + desc + '\n'
            i++
        }

        this.pc = savePc

        console.log(s)
    }
}

module.exports = { 
    Machine
}
