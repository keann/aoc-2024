import { readInputStrings } from '@input'

const strings = await readInputStrings()
const height = strings.length
const width = strings[0].length

type Point = [number, number]
const getCharAtPoint = ([x, y]: Point) => strings[x]?.[y]

type Sequence = Point[]
const XMAS = Array.from('XMAS')
const verifySequence = (seq: Sequence) => XMAS.every((char, i) => getCharAtPoint(seq[i]) === char)

let result = 0

for (let i = 0; i < height; i++) {
	for (let j = 0; j < width; j++) {
		result += countXmas(i, j)
	}
}

console.log(result)

function countXmas(x: number, y: number) {
	const sequences: Sequence[] = [
		[
			[x, y],
			[x + 1, y],
			[x + 2, y],
			[x + 3, y],
		],
		[
			[x, y],
			[x - 1, y],
			[x - 2, y],
			[x - 3, y],
		],
		[
			[x, y],
			[x, y + 1],
			[x, y + 2],
			[x, y + 3],
		],
		[
			[x, y],
			[x, y - 1],
			[x, y - 2],
			[x, y - 3],
		],
		[
			[x, y],
			[x + 1, y + 1],
			[x + 2, y + 2],
			[x + 3, y + 3],
		],
		[
			[x, y],
			[x - 1, y + 1],
			[x - 2, y + 2],
			[x - 3, y + 3],
		],
		[
			[x, y],
			[x + 1, y - 1],
			[x + 2, y - 2],
			[x + 3, y - 3],
		],
		[
			[x, y],
			[x - 1, y - 1],
			[x - 2, y - 2],
			[x - 3, y - 3],
		],
	]

	return sequences.map(verifySequence).filter(Boolean).length
}
