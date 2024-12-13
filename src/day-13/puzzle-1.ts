import { readInputSectionStrings } from '@input'

const options = await readInputSectionStrings()
const MAX_PRESSES = 100
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
	return match?.groups ? { x: Number(match.groups.X), y: Number(match.groups.Y) } : null
}

const calcTokens = (coordsA: Coords, coordsB: Coords, prizeCoords: Coords): number | null => {
	let minCost: number | null = null

	for (let a = 0; a <= MAX_PRESSES; a++) {
		for (let b = 0; b <= MAX_PRESSES; b++) {
			const x = coordsA.x * a + coordsB.x * b
			const y = coordsA.y * a + coordsB.y * b

			if (x === prizeCoords.x && y === prizeCoords.y) {
				const cost = COST.a * a + COST.b * b

				if (minCost === null || cost < minCost) {
					minCost = cost
				}
			}
		}
	}

	return minCost
}

const processInputSection = (input: string[]): number | null => {
	const [buttonAConfig, buttonBConfig, prizeConfig] = input
	const coordsA = parseButtonConfig(buttonAConfig)
	const coordsB = parseButtonConfig(buttonBConfig)
	const prizeCoords = parsePrizeConfig(prizeConfig)

	if (!coordsA || !coordsB || !prizeCoords) {
		console.error(`Could not parse input:\n${input}`)
		return null
	}

	return calcTokens(coordsA, coordsB, prizeCoords)
}

const tokensToSpent = options.map(processInputSection).reduce<number>((acc, val) => acc + (val ?? 0), 0)

console.log(tokensToSpent)
