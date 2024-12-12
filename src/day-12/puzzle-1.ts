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
const addDirection = (coords: Coords, direction: Coords): Coords => [coords[0] + direction[0], coords[1] + direction[1]]

const inspectedPlots: boolean[][] = Array.from({ length: strings.length }, () => Array(strings[0].length).fill(false))
const getInspected = ([x, y]: Coords) => inspectedPlots[y]?.[x]
const setInspected = ([x, y]: Coords) => {
	inspectedPlots[y][x] = true
}

const inspectPlot = (startCoords: Coords, plotType: string): { area: number; perimeter: number } => {
	setInspected(startCoords)

	let area = 0
	let perimeter = 0
	const coordsToInspect: Coords[] = [startCoords]

	while (coordsToInspect.length) {
		const currentCoords = coordsToInspect.pop() as Coords

		for (const direction of directions) {
			const nextCoords = addDirection(currentCoords, direction)

			if (plotExists(nextCoords)) {
				const nextPlotType = getPlotType(nextCoords)

				if (nextPlotType !== plotType) {
					perimeter += 1
				} else if (!getInspected(nextCoords)) {
					coordsToInspect.push(nextCoords)
					setInspected(nextCoords)
				}
			} else {
				perimeter += 1
			}
		}

		area += 1
	}

	return { area, perimeter }
}

let cost = 0

for (let y = 0; y <= Y_MAX; y++) {
	for (let x = 0; x <= X_MAX; x++) {
		const plotCoords: Coords = [x, y]

		if (!getInspected(plotCoords)) {
			const plotType = getPlotType(plotCoords)
			const { area, perimeter } = inspectPlot(plotCoords, plotType)

			cost += area * perimeter
		}
	}
}

console.log(cost)
