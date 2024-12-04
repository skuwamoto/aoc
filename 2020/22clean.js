const fs = require('fs');

var text = fs.readFileSync('./22.txt', 'utf8')
var cards = text.trim().split('\n\n').map(x => x.split('\n'))
cards[0].shift()
cards[1].shift()
cards[0] = cards[0].map(x => Number(x))
cards[1] = cards[1].map(x => Number(x))

// array to num
//.map(x => parseInt(x))

// reverse array
//.split('').reverse().join('')

// str to array
//.split('') 

var shortText = fs.readFileSync('./22short.txt', 'utf8')
var shortCards = shortText.trim().split('\n\n').map(x => x.split('\n'))
shortCards[0].shift()
shortCards[1].shift()
shortCards[0] = shortCards[0].map(x => Number(x))
shortCards[1] = shortCards[1].map(x => Number(x))

var badText = fs.readFileSync('./22bad.txt', 'utf8')
var badCards = badText.trim().split('\n\n').map(x => x.split('\n'))
badCards[0].shift()
badCards[1].shift()
badCards[0] = badCards[0].map(x => Number(x))
badCards[1] = badCards[1].map(x => Number(x))

function part1(cards) {
    let round = 1
    while (cards[0].length > 0 && cards[1].length > 0) {
        if (cards[0][0] > cards[1][0]) {
            cards[0].push(cards[0].shift())
            cards[0].push(cards[1].shift())
        } else {
            cards[1].push(cards[1].shift())
            cards[1].push(cards[0].shift())
        }

    }
    let winner = (cards[0].length > 0) ? 0 : 1

    let sum = 0;
    for (let i=1; i <= cards[winner].length; i++) {
        sum += i * cards[winner][cards[winner].length-i]
    }
    return sum
}

function playGame(cards, game) {
    console.log('starting game', game)

    let seen = {}
    let winner = null
    let round = 0
    while (true) {
        round++
        // console.log('-- Round', round, '(Game', game, ') --')
        // console.log('Player 1:', cards[0])
        // console.log('Player 2:', cards[1])

        let key = cards[0].join(',') + ':' + cards[1].join(',')
        if (seen[key]) {
            cards[2] = 0
            return cards
        }
        seen[key] = true
        let card0 = cards[0].shift()
        let card1 = cards[1].shift()
        // console.log('Player 1 plays:', card0)
        // console.log('Player 2 plays:', card1)
        if (cards[0].length >= card0 && cards[1].length >= card1) {
            let newDeck = [cards[0].slice(0, card0), cards[1].slice(0, card1)]
            newDeck = playGame(newDeck, game+1)
            winner = newDeck[2]
        }
        else {
            winner = (card0 > card1) ? 0 : 1
        }

        if (winner == 0) {
            cards[0].push(card0)
            cards[0].push(card1)
        } else {
            cards[1].push(card1)
            cards[1].push(card0)
        }
        // console.log('Winner:', winner+1)
        if (cards[0].length == 0 || cards[1].length == 0) {
            winner = cards[0].length == 0 ? 1 : 0
            cards[2] = winner
            // console.log('Game', game, 'is over for player:', winner+1)
            return cards
        }
    }
}

function part2(cards) {
    cards = playGame(cards.slice(), 1)
    let winner = cards[2]

    let sum = 0;
    for (let i=1; i <= cards[winner].length; i++) {
        sum += i * cards[winner][cards[winner].length-i]
    }
    return sum
}

console.log('-----------------------------------------------------------------')
console.log('Part 1')
// console.log(part1(shortCards.slice()))
// console.log(part1(cards.slice()))
console.log('--')
console.log('Part 2')
// console.log(part2(shortCards))
// console.log(part2(badCards))
console.log(part2(cards))
console.log('-----------------------------------------------------------------')
 