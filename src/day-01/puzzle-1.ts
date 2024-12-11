import { readInputStrings } from '@input'

const strings = await readInputStrings()

const left: number[] = []
const right: number[] = []

for (const string of strings) {
	const [a, b] = string.split('   ').map(Number)
	left.push(a)
	right.push(b)
}

left.sort()
right.sort()

const result = left.reduce((diff, leftValue, index) => diff + Math.abs(leftValue - right[index]), 0)

console.log(result)
