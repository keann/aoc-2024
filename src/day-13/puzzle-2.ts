import { readInputSectionStrings } from '@input'

const options = await readInputSectionStrings()
const SHIFT = 10000000000000
const COST = {
	a: 3,
	b: 1,
} as const

type Coords = { x: number; y: number }
const parseButtonConfig = (buttonConfig: string): Coords | null => {
	const match = buttonConfig.match(/X\+(?<X>(\d+)), Y\+(?<Y>(\d+))/)
	return match?.groups ? { x: Number(match.groups.X), y: Number(match.groups.Y) } : null
}
const parsePrizeConfig = (prizeConfig: string): Coords | null => {
	const match = prizeConfig.match(/X=(?<X>(\d+)), Y=(?<Y>(\d+))/)
	return match?.groups ? { x: Number(match.groups.X) + SHIFT, y: Number(match.groups.Y) + SHIFT } : null
}

type Factors = { a: number; b: number }
const findFactors = (coordsA: Coords, coordsB: Coords, target: Coords): Factors | null => {
	const a = (coordsB.x * target.y - coordsB.y * target.x) / (coordsA.y * coordsB.x - coordsA.x * coordsB.y)
	const b = (target.x - coordsA.x * a) / coordsB.x

	return a % 1 !== 0 || b % 1 !== 0 ? null : { a, b }
}

const calcTokens = (coordsA: Coords, coordsB: Coords, prizeCoords: Coords) => {
	const factors = findFactors(coordsA, coordsB, prizeCoords)

	return factors ? COST.a * factors.a + COST.b * factors.b : null
}

const processInputSection = (input: string[]): number | null => {
	const [buttonAConfig, buttonBConfig, prizeConfig] = input
	const coordsA = parseButtonConfig(buttonAConfig)
	const coordsB = parseButtonConfig(buttonBConfig)
	const prizeCoords = parsePrizeConfig(prizeConfig)

	if (!coordsA || !coordsB || !prizeCoords) {
		return null
	}

	return calcTokens(coordsA, coordsB, prizeCoords)
}

const tokensToSpent = options.map(processInputSection).reduce<number>((acc, val) => acc + (val ?? 0), 0)

console.log(tokensToSpent)
