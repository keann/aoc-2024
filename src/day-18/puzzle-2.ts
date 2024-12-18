import { readInputStrings } from '@input'

const strings = await readInputStrings()

const MAX_MEMORY_COORD = 70
const FIRST_FALLEN_BYTES = 1024

type Coords = [number, number]
const directions: Coords[] = [
	[0, 1],
	[1, 0],
	[0, -1],
	[-1, 0],
]

const memory = Array.from({ length: MAX_MEMORY_COORD + 1 }, () => Array(MAX_MEMORY_COORD + 1).fill(0))
const getMemoryCell = ([x, y]: Coords) => memory[y]?.[x]
const canMoveToCell = (coords: Coords) => getMemoryCell(coords) === 0
const isFinish = ([x, y]: Coords) => x === MAX_MEMORY_COORD && y === MAX_MEMORY_COORD

const dropByte = (byte: string) => {
	const [x, y] = byte.split(',').map(Number)
	memory[y][x] = 1
}
for (const byte of strings.slice(0, FIRST_FALLEN_BYTES)) {
	dropByte(byte)
}

const traverse = () => {
	type Path = [Coords, number]
	const paths: Path[] = [[[0, 0], 0]]
	const cellSteps = new Map<string, number>()
	let minSteps = Infinity

	while (paths.length > 0) {
		const [coords, steps] = paths.shift() as Path
		const [x, y] = coords
		const cellKey = `${x},${y}`
		const cellMinSteps = cellSteps.get(cellKey) ?? Infinity

		if (steps >= minSteps || steps >= cellMinSteps) {
			continue
		}
		cellSteps.set(cellKey, steps)

		if (isFinish(coords)) {
			minSteps = steps
		}

		for (const [dx, dy] of directions) {
			const nextCoords: Coords = [x + dx, y + dy]

			if (canMoveToCell(nextCoords)) {
				paths.push([nextCoords, steps + 1])
			}
		}
	}

	return minSteps
}

let blockingByte: string | undefined

for (const byte of strings.slice(FIRST_FALLEN_BYTES)) {
	dropByte(byte)

	if (traverse() === Infinity) {
		blockingByte = byte
		break
	}
}

console.log(blockingByte)
