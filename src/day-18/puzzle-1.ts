import { readInputStrings } from '@input'

const strings = await readInputStrings()

const MAX_MEMORY_COORD = 70
const FALLEN_BYTES = 1024

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

for (const byte of strings.slice(0, FALLEN_BYTES)) {
	const [x, y] = byte.split(',').map(Number)
	memory[y][x] = 1
}

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

console.log(minSteps)
