import { readInputSectionStrings } from '@input'

const [mapStrings, movesStrings] = await readInputSectionStrings()

type Coords = { x: number; y: number }
type MoveType = '^' | '>' | 'v' | '<'
const enum ObjectType {
	Wall = '#',
	Box = 'O',
	Robot = '@',
	Empty = '.',
}

const map = mapStrings.map(s => s.split('')) as ObjectType[][]
const Y_MIN = 1
const Y_MAX = map.length - 2
const X_MIN = 1
const X_MAX = map[0].length - 2
const getObjectType = ({ x, y }: Coords): ObjectType | undefined => map[y]?.[x]

const DIRECTIONS: Record<MoveType, Coords> = {
	'^': { x: 0, y: -1 },
	'>': { x: 1, y: 0 },
	v: { x: 0, y: 1 },
	'<': { x: -1, y: 0 },
}
const getNextCoords = (coords: Coords, direction: Coords): Coords => ({
	x: coords.x + direction.x,
	y: coords.y + direction.y,
})
const moveObjectOnMap = ({ x, y }: Coords, { x: nx, y: ny }: Coords) => {
	map[ny][nx] = map[y][x]
	map[y][x] = ObjectType.Empty
}

const tryToMoveObject = (coords: Coords, direction: Coords): Coords | null => {
	const nextCoords = getNextCoords(coords, direction)

	switch (getObjectType(nextCoords)) {
		case ObjectType.Empty:
			moveObjectOnMap(coords, nextCoords)
			return nextCoords

		case ObjectType.Box:
			if (tryToMoveObject(nextCoords, direction) !== null) {
				moveObjectOnMap(coords, nextCoords)
				return nextCoords
			}
	}

	return null
}

let robotCoords: Coords = { x: 0, y: 0 }
for (let y = Y_MIN; y <= Y_MAX; y++) {
	const x = map[y].findIndex(v => v === ObjectType.Robot)
	if (x !== -1) {
		robotCoords = { x, y }
		break
	}
}

const moves = movesStrings.join('').split('') as MoveType[]
for (const moveType of moves) {
	const direction = DIRECTIONS[moveType]
	robotCoords = tryToMoveObject(robotCoords, direction) ?? robotCoords
}

let gpsSummary = 0
for (let y = Y_MIN; y <= Y_MAX; y++) {
	for (let x = X_MIN; x <= X_MAX; x++) {
		if (getObjectType({ x, y }) === ObjectType.Box) {
			gpsSummary += y * 100 + x
		}
	}
}

console.log(gpsSummary)
