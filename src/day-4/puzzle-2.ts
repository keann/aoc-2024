import { readInputStrings } from '@input'

const strings = await readInputStrings()
const height = strings.length
const width = strings[0].length

type Point = [number, number]
const getCharAtPoint = ([x, y]: Point) => strings[x]?.[y]

type Sequence = Point[]
const REF_SEQUENCES = [Array.from('MAS'), Array.from('SAM')]
const verifySequence = (seq: Sequence) =>
	REF_SEQUENCES.some(refSeq => refSeq.every((char, i) => getCharAtPoint(seq[i]) === char))

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
			[x - 1, y - 1],
			[x, y],
			[x + 1, y + 1],
		],
		[
			[x - 1, y + 1],
			[x, y],
			[x + 1, y - 1],
		],
	]

	return sequences.every(verifySequence) ? 1 : 0
}
