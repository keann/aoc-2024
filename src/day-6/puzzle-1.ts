import { readInputStrings } from '@input'

const strings = await readInputStrings()

const X_MAX = strings[0].length
const Y_MAX = strings.length

type Direction = 'up' | 'down' | 'left' | 'right'
const DIRECTION: Record<string, Direction> = {
	'^': 'up',
	v: 'down',
	'<': 'left',
	'>': 'right',
} as const

const DIRECTION_SEQ: Direction[] = ['up', 'right', 'down', 'left']
const getNextDirection = (currentDirection: Direction): Direction =>
	DIRECTION_SEQ[(DIRECTION_SEQ.indexOf(currentDirection) + 1) % DIRECTION_SEQ.length]

type Coordinates = { x: number; y: number }
const DIRECTION_DIFF: Record<Direction, Coordinates> = {
	up: { x: 0, y: -1 },
	down: { x: 0, y: 1 },
	left: { x: -1, y: 0 },
	right: { x: 1, y: 0 },
} as const

type PlaceChar = '.' | '#'
const PLACE_TYPE: Record<string, PlaceChar> = {
	free: '.',
	obstacle: '#',
} as const

let [guardCoords, guardDirection]: [Coordinates, Direction] = (() => {
	for (let y = 0; y < Y_MAX; y++) {
		for (let x = 0; x < X_MAX; x++) {
			const char = strings[y][x] as PlaceChar

			if (char !== PLACE_TYPE.free && char !== PLACE_TYPE.obstacle) {
				return [{ x, y }, DIRECTION[char]]
			}
		}
	}
	return [{ x: 0, y: 0 }, 'up']
})()

const visitedPlaces = new Set<string>()
while (true) {
	visitedPlaces.add(`${guardCoords.x},${guardCoords.y}`)

	const coordDiff = DIRECTION_DIFF[guardDirection]
	const nextCoords = {
		x: guardCoords.x + coordDiff.x,
		y: guardCoords.y + coordDiff.y,
	}
	const nextChar = strings[nextCoords.y]?.[nextCoords.x]

	if (!nextChar) {
		break
	}

	if (nextChar === PLACE_TYPE.obstacle) {
		guardDirection = getNextDirection(guardDirection)
	} else {
		guardCoords = nextCoords
	}
}

console.log(visitedPlaces.size)
