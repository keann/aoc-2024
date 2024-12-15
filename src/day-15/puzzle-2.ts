import { readInputSectionStrings } from '@input'

const [mapStrings, movesStrings] = await readInputSectionStrings()

type Coords = { x: number; y: number }
type MoveType = '^' | '>' | 'v' | '<'
const enum ObjectType {
	Wall = '#',
	Box = 'O',
	BoxLeft = '[',
	BoxRight = ']',
	Robot = '@',
	Empty = '.',
}

let robotCoords: Coords = { x: 0, y: 0 }
const map = mapStrings.reduce<ObjectType[][]>((accY, string, y) => {
	const chars = string.split('') as ObjectType[]
	const row = chars.reduce<ObjectType[]>((accX, char, x) => {
		switch (char) {
			case ObjectType.Wall:
				accX.push(ObjectType.Wall)
				accX.push(ObjectType.Wall)
				break
			case ObjectType.Box:
				accX.push(ObjectType.BoxLeft)
				accX.push(ObjectType.BoxRight)
				break
			case ObjectType.Robot:
				accX.push(ObjectType.Robot)
				accX.push(ObjectType.Empty)
				robotCoords = { x: x * 2, y }
				break
			default:
				accX.push(ObjectType.Empty)
				accX.push(ObjectType.Empty)
				break
		}
		return accX
	}, [])
	accY.push(row)
	return accY
}, [])

const Y_MIN = 1
const Y_MAX = map.length - 2
const X_MIN = 2
const X_MAX = map[0].length - 3
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
const moveObjectOnMap = ({ x, y }: Coords, { x: nx, y: ny }: Coords): Coords => {
	map[ny][nx] = map[y][x]
	map[y][x] = ObjectType.Empty
	return { x: nx, y: ny }
}

const isBox = (objectType: ObjectType | undefined): boolean =>
	objectType === ObjectType.BoxLeft || objectType === ObjectType.BoxRight
const getFullBoxCoords = (coords: Coords): [Coords, Coords] => {
	const objectType = getObjectType(coords)
	const otherPartXDiff = objectType === ObjectType.BoxLeft ? 1 : -1
	return [coords, { x: coords.x + otherPartXDiff, y: coords.y }]
}

const moveBox = (boxCoords: Coords[], direction: Coords) => {
	for (const coords of boxCoords) {
		const nextCoords = getNextCoords(coords, direction)
		const nextObjectType = getObjectType(nextCoords)

		if (isBox(nextObjectType)) {
			const nextBoxCoords = getFullBoxCoords(nextCoords)
			moveBox(nextBoxCoords, direction)
		}

		moveObjectOnMap(coords, nextCoords)
	}
}
const boxCanBeMoved = (boxCoords: Coords[], direction: Coords): boolean =>
	boxCoords
		.map(coords => {
			const nextCoords = getNextCoords(coords, direction)

			switch (getObjectType(nextCoords)) {
				case ObjectType.Empty:
					return true

				case ObjectType.BoxLeft:
				case ObjectType.BoxRight: {
					const nextBoxCoords = getFullBoxCoords(nextCoords)
					return boxCanBeMoved(nextBoxCoords, direction)
				}

				default:
					return false
			}
		})
		.every(Boolean)

const moveObject = (coords: Coords, direction: Coords): Coords | null => {
	const isVerticalMove = direction.x === 0
	const objectType = getObjectType(coords)
	const nextCoords = getNextCoords(coords, direction)

	if (isVerticalMove && isBox(objectType)) {
		const boxCoords = getFullBoxCoords(coords)

		if (!boxCanBeMoved(boxCoords, direction)) {
			return null
		}

		moveBox(boxCoords, direction)
		return nextCoords
	}

	switch (getObjectType(nextCoords)) {
		case ObjectType.Wall:
			return null

		case ObjectType.Empty:
			return moveObjectOnMap(coords, nextCoords)

		default: {
			if (moveObject(nextCoords, direction) === null) {
				return null
			}

			return moveObjectOnMap(coords, nextCoords)
		}
	}
}

const moves = movesStrings.join('').split('') as MoveType[]
for (const moveType of moves) {
	const direction = DIRECTIONS[moveType]
	robotCoords = moveObject(robotCoords, direction) ?? robotCoords
}

let gpsSummary = 0
for (let y = Y_MIN; y <= Y_MAX; y++) {
	for (let x = X_MIN; x <= X_MAX; x++) {
		if (getObjectType({ x, y }) === ObjectType.BoxLeft) {
			gpsSummary += y * 100 + x
		}
	}
}

console.log(gpsSummary)
