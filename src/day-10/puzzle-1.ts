import { readInputStrings } from '@input'

const strings = await readInputStrings()

type Coords = [number, number]
const Y_MAX = strings.length - 1
const X_MAX = strings[0].length - 1

const coordsExist = ([x, y]: Coords) => x >= 0 && y >= 0 && x <= X_MAX && y <= Y_MAX
const getHeightAt = ([x, y]: Coords) => (coordsExist([x, y]) ? Number(strings[y][x]) : null)

const directions: Coords[] = [
	[0, -1],
	[0, 1],
	[-1, 0],
	[1, 0],
]

const trailheads: Coords[] = []

for (let y = 0; y <= Y_MAX; y++) {
	for (let x = 0; x <= X_MAX; x++) {
		const height = getHeightAt([x, y])

		if (height === 0) {
			trailheads.push([x, y])
		}
	}
}

const getTrailScore = (startCoords: Coords): number => {
	const trailends = new Set<string>()

	const traverseTrail = (prevCoords: Coords, prevHeight: number) => {
		for (const direction of directions) {
			const nextCoords: Coords = [prevCoords[0] + direction[0], prevCoords[1] + direction[1]]
			const nextHeight = getHeightAt(nextCoords)

			if (!nextHeight || nextHeight - prevHeight !== 1) {
				continue
			}

			if (nextHeight === 9) {
				trailends.add(`${nextCoords[0]},${nextCoords[1]}`)
			}

			traverseTrail(nextCoords, nextHeight)
		}
	}

	traverseTrail(startCoords, 0)

	return trailends.size
}

const scoresSummary = trailheads.map(getTrailScore).reduce((acc, score) => acc + score, 0)

console.log(scoresSummary)
