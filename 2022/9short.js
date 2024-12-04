const fs = require('fs');
input = fs.readFileSync('./input9.txt', 'utf8');

input = input.split('\n').map(x=>x.split(' '))
K=Array(10).fill().map(x=>[0,0])
H=K[0]
T=K[9]
v=new Set().add(''+T)
for ([d,n] of input) { for (i=n;i--;) {
	H[{R:1,L:1,U:0,D:0}[d]]+={R:1,D:1}[d]?1:-1
	K.reduce((h,t)=>((t[0]-h[0])**2>1||(t[1]-h[1])**2>1)?(t[0]+=Math.sign(h[0]-t[0]),t[1]+=Math.sign(h[1]-t[1]),t):t)
	v.add(''+T)
}}
console.log(v.size)
