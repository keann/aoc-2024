const file = await Bun.file('./input.txt').text()
const strings = file.split('\n')

const left = new Map<number, number>()
const right = new Map<number, number>()

for (const string of strings) {
	const [a, b] = string.split('   ').map(Number)
	left.set(a, (left.get(a) ?? 0) + 1)
	right.set(b, (right.get(b) ?? 0) + 1)
}

const result = left
	.entries()
	.reduce((diff, [value, leftCount]) => diff + value * leftCount * (right.get(value) ?? 0), 0)

console.log(result)
