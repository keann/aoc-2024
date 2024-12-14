import { readInputStrings } from '@input'

const strings = await readInputStrings()

const HEIGHT = 103
const WIDTH = 101
const TIMEOUT = 100

const X_MAX = WIDTH - 1
const Y_MAX = HEIGHT - 1
const X_HALF = X_MAX / 2
const Y_HALF = Y_MAX / 2

type Coords = { x: number; y: number }
type Robot = {
	p: Coords
	v: Coords
}

const robots = strings.reduce<Robot[]>((acc, string) => {
	const match = string.match(/p=(?<px>-?\d+),(?<py>-?\d+) v=(?<vx>-?\d+),(?<vy>-?\d+)/)
	if (match) {
		const [px, py, vx, vy] = match.slice(1, 5).map(Number)
		acc.push({ p: { x: px, y: py }, v: { x: vx, y: vy } })
	}
	return acc
}, [])
const moveRobot = (robot: Robot): Coords => {
	let x = (robot.p.x + robot.v.x * TIMEOUT) % WIDTH
	let y = (robot.p.y + robot.v.y * TIMEOUT) % HEIGHT

	if (x < 0) x += WIDTH
	if (y < 0) y += HEIGHT

	robot.p = { x, y }

	return { x, y }
}

const quadrants: number[] = [0, 0, 0, 0]
const getQuadrant = ({ x, y }: Coords): number | null => {
	if (x === X_HALF || y === Y_HALF) return null

	if (x < X_HALF) {
		return y < Y_HALF ? 0 : 2
	}

	return y < Y_HALF ? 1 : 3
}

for (const robot of robots) {
	const finalCoords = moveRobot(robot)
	const quadrantIndex = getQuadrant(finalCoords)

	if (quadrantIndex !== null) {
		quadrants[quadrantIndex] += 1
	}
}

const safetyFactor = quadrants.reduce((acc, v) => acc * v, 1)
console.log(safetyFactor)
