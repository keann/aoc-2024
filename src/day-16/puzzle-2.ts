import { readInputStrings } from '@input'

const strings = await readInputStrings()

type Coords = [number, number]
const getTile = ([x, y]: Coords) => strings[y]?.[x]
const isWall = (coords: Coords) => getTile(coords) === '#'
const isFinish = (coords: Coords) => getTile(coords) === 'E'

type Direction = (typeof directionsOrder)[number]
const directionsOrder = ['up', 'right', 'down', 'left'] as const
const DIRECTION_DIFF: Record<Direction, Coords> = {
	up: [0, -1],
	down: [0, 1],
	left: [-1, 0],
	right: [1, 0],
}

const startCoords: Coords = (() => {
	for (let y = 1; y <= strings.length - 2; y++) {
		for (let x = 1; x <= strings[0].length - 2; x++) {
			if (getTile([x, y]) === 'S') {
				return [x, y]
			}
		}
	}
	throw new Error('No start coords')
})()

const move = (coords: Coords, direction: Direction) => {
	const diff = DIRECTION_DIFF[direction]
	const nextCoords: Coords = [coords[0] + diff[0], coords[1] + diff[1]]
	return isWall(nextCoords) ? false : nextCoords
}
const rotate = (direction: Direction, clockwise: boolean): Direction => {
	const index = directionsOrder.indexOf(direction)
	const diff = clockwise ? 1 : -1
	const l = directionsOrder.length
	const nextIndex = (index + diff + l) % l
	return directionsOrder[nextIndex]
}

type Path = [Coords, Direction, number, string[]]
const paths: Path[] = [[startCoords, 'right', 0, []]]
const tileScores = new Map<string, number>()
const bestPaths: Array<{ tiles: string[]; score: number }> = []
let minScore = Infinity

while (paths.length > 0) {
	const path = paths.shift() as Path
	const [coords, direction, score] = path
	const visitedTiles = path[3].concat(`${coords[0]},${coords[1]}`)

	const tileKey = `${coords[0]},${coords[1]},${direction}`
	const tileMinScore = tileScores.get(tileKey) ?? Infinity

	if (score > minScore || score > tileMinScore) {
		continue
	}
	tileScores.set(tileKey, score)

	if (isFinish(coords)) {
		minScore = score
		bestPaths.push({ tiles: visitedTiles, score })
	}

	const nextCoords = move(coords, direction)
	if (nextCoords) {
		paths.unshift([nextCoords, direction, score + 1, visitedTiles])
	}

	for (const newDirection of [rotate(direction, true), rotate(direction, false)]) {
		paths.push([coords, newDirection, score + 1000, visitedTiles])
	}
}

const uniqueBestTiles = new Set(bestPaths.filter(({ score }) => score === minScore).flatMap(({ tiles }) => tiles))

console.log(uniqueBestTiles.size)
