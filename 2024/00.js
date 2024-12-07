const fs = require('fs');
const u = require('./util2')

let test = fs.readFileSync('./test06.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./sean06.txt', {encoding:'utf8', flag:'r'});

let g = u.Grid.parse(test)
g.print()
