import { readInputStrings } from '@input'
import { get } from 'node:http'

const strings = await readInputStrings()
const map = strings.slice(1, strings.length - 1).map(row => row.slice(1, row.length - 1))

type Coords = [number, number]
const getTile = ([x, y]: Coords) => map[y]?.[x]
const getTileKey = (coords: Coords) => coords.join(',')
const isWall = (coords: Coords) => getTile(coords) === '#'
const canMoveToTile = (coords: Coords) => {
	const tile = getTile(coords)
	return tile !== undefined && tile !== '#'
}
const isFinish = (coords: Coords) => getTile(coords) === 'E'

const initialCoords: Coords = (() => {
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[0].length; x++) {
			if (getTile([x, y]) === 'S') {
				return [x, y]
			}
		}
	}
	throw new Error('No start coords')
})()
const directions: Coords[] = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
]

type Path = { coords: Coords; visited?: Set<string>; path?: Coords[] }
const getBestPaths = (startCoords: Coords) => {
	let minScore = Infinity
	const bestPaths: Coords[][] = []
	const paths: Path[] = [{ coords: startCoords }]

	while (paths.length > 0) {
		const { coords, visited = new Set(), path = [] } = paths.shift() as Path
		const tileKey = getTileKey(coords)

		if (visited.has(tileKey) || visited.size >= minScore) {
			continue
		}

		if (isFinish(coords)) {
			minScore = visited.size
			bestPaths.push(path)
			continue
		}

		const newVisited = new Set(visited)
		newVisited.add(tileKey)

		const [x, y] = coords
		for (const [dx, dy] of directions) {
			const nextCoords: Coords = [x + dx, y + dy]

			if (canMoveToTile(nextCoords)) {
				paths.push({ coords: nextCoords, visited: newVisited, path: [...path, coords] })
			}
		}
	}

	return {
		minScore,
		bestPaths: bestPaths.filter(path => path.length === minScore),
	}
}

const { minScore, bestPaths } = getBestPaths(initialCoords)
const scoresCache = new Map<string, number>()
for (const bestPath of bestPaths) {
	for (let i = 0; i < bestPath.length; i++) {
		scoresCache.set(getTileKey(bestPath[i]), bestPath.length - i)
	}
}

const cheatedMinScores: number[] = []

for (const bestPath of bestPaths) {
	bestPath.forEach(([x, y], index) => {
		for (const [dx, dy] of directions) {
			const nextCoords: Coords = [x + dx, y + dy]
			const furtherCoords: Coords = [x + dx * 2, y + dy * 2]

			if (isWall(nextCoords) && canMoveToTile(furtherCoords)) {
				let score = scoresCache.get(getTileKey(furtherCoords))
				score ??= getBestPaths(furtherCoords).minScore
				cheatedMinScores.push(score + index + 2)
			}
		}
	})
}

const bestCheatsCount = cheatedMinScores.reduce<number>(
	(acc, cheatedMinScore) => (minScore - cheatedMinScore >= 100 ? acc + 1 : acc),
	0,
)

console.log(bestCheatsCount)
