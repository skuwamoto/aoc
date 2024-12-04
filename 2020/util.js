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

