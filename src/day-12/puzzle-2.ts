import { readInputStrings } from '@input'

const strings = await readInputStrings()

type Coords = [number, number]
const Y_MAX = strings.length - 1
const X_MAX = strings[0].length - 1
const plotExists = ([x, y]: Coords) => x >= 0 && y >= 0 && x <= X_MAX && y <= Y_MAX
const getPlotType = ([x, y]: Coords) => strings[y]?.[x]

const directions: Coords[] = [
	[0, 1],
	[1, 0],
	[0, -1],
	[-1, 0],
]
const moveToDirection = (coords: Coords, direction: Coords): Coords => [
	coords[0] + direction[0],
	coords[1] + direction[1],
]

const inspectedPlots: boolean[][] = Array.from({ length: strings.length }, () => Array(strings[0].length).fill(false))
const getInspected = ([x, y]: Coords) => inspectedPlots[y]?.[x]
const setInspected = ([x, y]: Coords) => {
	inspectedPlots[y][x] = true
}

const inspectPlot = (startCoords: Coords, plotType: string): { area: number; sidesCount: number } => {
	setInspected(startCoords)

	let area = 0
	const sides = new Map<string, number[]>()
	const coordsToInspect: Coords[] = [startCoords]

	const recordSide = (coords: Coords, direction: Coords) => {
		const isXDirection = direction[1] === 0
		const dir = isXDirection ? direction[0] : direction[1]
		const keyCoord = isXDirection ? `x${coords[0]}` : `y${coords[1]}`
		const valueCoord = isXDirection ? coords[1] : coords[0]

		const key = `${keyCoord},${dir}`
		const values = sides.get(key) ?? []
		values.push(valueCoord)
		sides.set(key, values)
	}

	while (coordsToInspect.length) {
		const currentCoords = coordsToInspect.pop() as Coords

		for (const direction of directions) {
			const nextCoords = moveToDirection(currentCoords, direction)
			const nextPlotType = getPlotType(nextCoords)

			if (nextPlotType !== plotType) {
				recordSide(currentCoords, direction)
			} else if (!getInspected(nextCoords)) {
				coordsToInspect.push(nextCoords)
				setInspected(nextCoords)
			}
		}

		area += 1
	}

	const sidesCount = sides.entries().reduce((acc, [, values]) => {
		values.sort((a, b) => a - b)
		let addSides = 1

		for (let i = 1; i < values.length; i++) {
			if (values[i] - values[i - 1] !== 1) {
				addSides += 1
			}
		}

		return acc + addSides
	}, 0)

	return { area, sidesCount }
}

let cost = 0

for (let y = 0; y <= Y_MAX; y++) {
	for (let x = 0; x <= X_MAX; x++) {
		const plotCoords: Coords = [x, y]

		if (!getInspected(plotCoords)) {
			const plotType = getPlotType(plotCoords)
			const { area, sidesCount } = inspectPlot(plotCoords, plotType)

			cost += area * sidesCount
		}
	}
}

console.log(cost)
