const file = await Bun.file('./input.txt').text()
const strings = file.split('\n')

const left: number[] = []
const right: number[] = []

for (const stringPair of strings) {
	const [a, b] = stringPair.split('   ').map(Number)
	left.push(a)
	right.push(b)
}

left.sort()
right.sort()

const result = left.reduce((diff, leftValue, index) => diff + Math.abs(leftValue - right[index]), 0)

console.log(result)
