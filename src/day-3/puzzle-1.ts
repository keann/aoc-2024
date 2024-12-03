import { readInputFile } from '@input'

const file = await readInputFile()
const matches = file.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)
const result = matches.reduce<number>((acc, match) => {
	const [a, b] = match.slice(1, 3).map(Number)
	return acc + a * b
}, 0)

console.log(result)
