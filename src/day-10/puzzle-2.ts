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

const getTrailRating = (startCoords: Coords): number => {
	let rating = 0

	const traverseTrail = (prevCoords: Coords, prevHeight: number) => {
		for (const direction of directions) {
			const nextCoords: Coords = [prevCoords[0] + direction[0], prevCoords[1] + direction[1]]
			const nextHeight = getHeightAt(nextCoords)

			if (!nextHeight || nextHeight - prevHeight !== 1) {
				continue
			}

			if (nextHeight === 9) {
				rating += 1
			}

			traverseTrail(nextCoords, nextHeight)
		}
	}

	traverseTrail(startCoords, 0)

	return rating
}

const ratingsSummary = trailheads.map(getTrailRating).reduce((acc, rating) => acc + rating, 0)

console.log(ratingsSummary)
