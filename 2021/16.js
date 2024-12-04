'use strict';
const fs = require('fs');

let input = fs.readFileSync('./input16.txt', {encoding:'utf8', flag:'r'});

let test1 = '8A004A801A8002F478'
let test2 = '620080001611562C8802118E34'
let test3 = 'C0015000016115A2E0802F182340'
let test4 = 'A0016C880162017C3686B18A3D4780'

let test5 = 'C200B40A82'
let test6 = '04005AC33890'
let test7 = '880086C3E88112'
let test8 = 'CE00C43D881120'
let test9 = 'D8005AC2A8F0'
let test10 = 'F600BC2D8F'
let test11 = '9C005AC2F8F0'
let test12 = '9C0141080250320F1802104A08'

let hexMap = {
	'0': '0000',
	'1': '0001',
	'2': '0010',
	'3': '0011',
	'4': '0100',
	'5': '0101',
	'6': '0110',
	'7': '0111',
	'8': '1000',
	'9': '1001',
	'A': '1010',
	'B': '1011',
	'C': '1100',
	'D': '1101',
	'E': '1110',
	'F': '1111',
}

function shiftN(input, num) {
	let result = ""
	for (let i=0; i < num; i++) {
		if (input.length == 0) {
			throw i
		}
		result += input.shift()
	}
	return result
}

function parseNext(input, prefix) {
	let result = { len: 0}

	result.version = parseInt(shiftN(input, 3), 2)
	result.typeId = parseInt(shiftN(input, 3), 2)
	result.len += 6

	if (result.typeId == 4) {
		result.num = ''
		let nextNum = ''
		do {
			nextNum = shiftN(input, 5) 
			result.num += nextNum.substring(1)
			result.len += 5
		} while (nextNum[0] == '1')

		result.num = parseInt(result.num, 2)

	} else {
		result.lengthTypeId = parseInt(shiftN(input, 1), 2)
		result.len++

		result.packets = []

		if (result.lengthTypeId == 0) {
			let nBits = parseInt(shiftN(input, 15), 2)
			result.len += 15

			let bitsSoFar = 0
			do {
				let subPacket = parseNext(input, prefix + '>>>>')
				result.len += subPacket.len
				bitsSoFar += subPacket.len
				result.packets.push(subPacket)
			} while (bitsSoFar < nBits)
		} else {
			let nPackets = parseInt(shiftN(input, 11), 2)
			result.len += 11

			let packetsSoFar = 0
			do {
				let subPacket = parseNext(input, prefix + '>>>>')
				result.len += subPacket.len
				packetsSoFar += 1
				result.packets.push(subPacket)
			} while (packetsSoFar < nPackets)
		}
	}
	return result
}

function countVersions(node) {
	let result = node.version

	if (node.typeId != 4) {
		for (let n of node.packets) {
			result += countVersions(n)
		}
	}

	return result
}

function compute(node) {
	let result = 0

	if (node.typeId == 0) {
		for (let p of node.packets) {
			result += compute(p)
		}
	} else if (node.typeId == 1) {
		result = 1
		for (let p of node.packets) {
			result *= compute(p)
		}
	} else if (node.typeId == 2) {
		result = compute(node.packets[0])
		for (let p of node.packets) {
			result = Math.min(result, compute(p))
		}
	} else if (node.typeId == 3) {
		result = compute(node.packets[0])
		for (let p of node.packets) {
			result = Math.max(result, compute(p))
		}
	} else if (node.typeId == 4) {
		result = node.num
	} else if (node.typeId == 5) {
		result = compute(node.packets[0]) > compute(node.packets[1]) ? 1 : 0
	} else if (node.typeId == 6) {
		result = compute(node.packets[0]) < compute(node.packets[1]) ? 1 : 0
	} else if (node.typeId == 7) {
		result = compute(node.packets[0]) == compute(node.packets[1]) ? 1 : 0
	} 

	return result
}

function partA(input) {
	let b = input.split('').map(x => hexMap[x]).join('').split('')

	console.log(b)

	let result = parseNext(b, '')
	return countVersions(result)
}

function partB(input) {
	let b = input.split('').map(x => hexMap[x]).join('').split('')

	let result = parseNext(b, '')
	return compute(result)
}

console.log(partA(test1))
console.log(partA(test2))
console.log(partA(test3))
console.log(partA(test4))
console.log(partA(input))
console.log('--')
console.log(partB(test5))
console.log(partB(test6))
console.log(partB(test7))
console.log(partB(test8))
console.log(partB(test9))
console.log(partB(test10))
console.log(partB(test11))
console.log(partB(test12))
console.log(partB(input))
