import { readInputStrings } from '@input'

const strings = await readInputStrings()

const HEIGHT = 103
const WIDTH = 101

type Coords = { x: number; y: number }
type Robot = {
	p: Coords
	v: Coords
}

const map = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0))
const stringifyMap = () => map.map(s => s.map(v => (v ? 'X' : ' ')).join('')).join('\n')

const robots = strings.reduce<Robot[]>((acc, string) => {
	const match = string.match(/p=(?<px>-?\d+),(?<py>-?\d+) v=(?<vx>-?\d+),(?<vy>-?\d+)/)
	if (match) {
		const [px, py, vx, vy] = match.slice(1, 5).map(Number)
		acc.push({ p: { x: px, y: py }, v: { x: vx, y: vy } })
	}
	return acc
}, [])
const moveRobot = (robot: Robot): Coords => {
	let x = (robot.p.x + robot.v.x) % WIDTH
	let y = (robot.p.y + robot.v.y) % HEIGHT

	if (x < 0) x += WIDTH
	if (y < 0) y += HEIGHT

	map[robot.p.y][robot.p.x] -= 1
	map[y][x] += 1

	robot.p = { x, y }

	return { x, y }
}

let seconds = 0

const update = () => {
	const uniquePositions = new Set<string>()

	seconds += 1

	for (const robot of robots) {
		const { x, y } = moveRobot(robot)
		uniquePositions.add(`${x},${y}`)
	}

	console.clear()
	console.log(seconds)

	if (uniquePositions.size === robots.length) {
		console.log(stringifyMap())
		setTimeout(update, 10000)
	} else {
		setTimeout(update, 0)
	}
}

update()
