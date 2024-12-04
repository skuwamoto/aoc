const fs = require('fs');

// array to num
//.map(x => parseInt(x))

// reverse array
//.split('').reverse().join('')

// str to array
//.split('') 

var text = fs.readFileSync('./23.txt', 'utf8')
var cups = text.trim().split('').map(x => Number(x))

var textShort = fs.readFileSync('./23short.txt', 'utf8')
var cupsShort = textShort.trim().split('').map(x => Number(x))

function part1(cups, moves) {
    let cur = 0
    cups = cups.slice()

    for (let turn=0; turn<moves; turn++) {
        // console.log('')
        // console.log('-- move', turn+1, '--')
        // console.log('cups:', cups.join(' '))
        // let t = 0
        // console.log('     ', cups.map(x => t++ == cur ? '-' : ' ').join(' '))
        let temp = []
        // remove three
        for (let i=0; i < 3; i++) {
            if (cur == cups.length-1) {
                cups.push(cups.shift())
                cur--
            }
            temp.push(cups[cur+1])
            cups.splice(cur+1, 1)
        }
        // console.log('pick up:', temp.join(' '))

        // choose dest
        let target = cups[cur]-1
        let dst = null
        let max = 0
        let min = 1000000000
        while (dst === null) {
            for (let i=0; i<cups.length; i++) {
                if (cups[i] > max) max = cups[i]
                if (cups[i] < min) min = cups[i]
                if (cups[i] == target) {
                    dst = i
                    break
                }
            }
            if (dst === null) {
                target--
                if (target < min) target = max
            }
        }

        // console.log('destination:', cups[dst])

        cups = cups.slice(0, dst+1).concat(temp).concat(cups.slice(dst+1))

        if (cur > dst) cur += 3

        cur = (cur+1) % cups.length
    }

    for (let i=0; i<cups.length; i++) {
        if (cups[i] == 1) {
            return cups.slice(i+1).join('') + cups.slice(0, i).join('')
        }
    }

}

function part2(cups, moves) {
    // Create a million cups
    cups = cups.slice()
    let max = 1_000_000
    for (let i=10; i <= max; i++) {
        cups.push(i)
    }
    let cur = 0

    // Do ten million moves yikes!
    for (let turn=0; turn<moves; turn++) {
        if (turn % 1000 == 0) {
            console.log('turn', turn)
        }
        // rotate current to position 0.
        while (cur > 0) {
            cups.push(cups.shift())
            cur--
        }

        // console.log('')
        // console.log('-- move', turn+1, '--')
        // console.log('cups:', cups.join(' '))
        // let t = 0
        // console.log('     ', cups.map(x => t++ == cur ? '-' : ' ').join(' '))

        // find destination
        let target = cups[cur]-1
        while (target > 0 && (target == cups[1] || target == cups[2] || target == cups[3])) {
            target--
        }
        // wrap around
        if (target == 0) {
            target = max
            while (target == cups[1] || target == cups[2] || target == cups[3]) {
                target--
            }
        }
        let dst
        for (let i=4; i<cups.length; i++) {
            if (cups[i] == target) {
                dst = i
                break
            }
        }

        // move items w/o mem allocation
        let temp = [cups[1], cups[2], cups[3]]
        // console.log('pick up:', temp.join(' '))
        // console.log('destination:', cups[dst])

        for (let i=1; i <= dst-3; i++) {
            cups[i] = cups[i+3]
        }
        // insert temp items
        for (let i=0; i<3; i++) {
            cups[dst-3+i+1] = temp[i]
        }

        cur++
    }

    for (let i=0; i < cups.length; i++) {
        if (cups[i] == 1) {
            return cups[(i+1)%cups.length] * cups[(i+2)%cups.length]
        }
    }
}

function part2a(cups, moves) {
    let max = 1_000_000
    let hash = new Map()
    let prev = null
    let first = null

    // Make a ring buffer and a hash
    for (let i=0; i < max; i++) {
        let c = (i < cups.length) ? cups[i] : i+1

        let o = { num: c}
        if (!prev) {
            o.next = o.prev = o
            first = o
        }
        if (prev) {
            o.prev = prev
            o.next = o.prev.next
            o,prev.next = o
            o.next.prev = o
        }
        hash.set(c, o)
        prev = o
    }

    let cur = first
    for (let turn=0; turn < moves; turn++) {
        // if (turn % 1000 == 0) {
        //     console.log('turn', turn)
        // }

        // console.log('')
        // console.log('-- move', turn+1, '--')
        // console.log('cups:', cur.num, cur.next.num, cur(' '))
        // let t = 0
        // console.log('     ', cups.map(x => t++ == cur ? '-' : ' ').join(' '))

        // Remove three items
        let temp = []
        for (let i=0; i < 3; i++) {
            temp.push(cur.next)
            cur.next = cur.next.next
            cur.next.prev = cur
        }
        
        // Find destination number
        let target = cur.num-1
        if (target == 0) target = max
        while (target == temp[0].num || target == temp[1].num || target == temp[2].num) {
            target--
            if (target == 0) target = max
        }

        let dst = hash.get(target)

        // Insert three after the current item
        for (let i=0; i < 3; i++) {
            let toInsert = temp.pop()
            toInsert.next = dst.next
            toInsert.prev = dst
            dst.next.prev = toInsert
            dst.next = toInsert
        }

        // Rotate cur
        cur = cur.next
    }
    let one = hash.get(1)
    console.log(one.next.num, one.next.next.num)
    return one.next.num * one.next.next.num
}


console.log('-----------------------------------------------------------------')
console.log('Part 1')
console.log(part1(cupsShort, 10))
console.log(part1(cups, 100))
console.log('--')
console.log('Part 2')
console.log(part2a(cupsShort, 10_000_000))
console.log(part2a(cups, 10_000_000))
console.log('-----------------------------------------------------------------')
 