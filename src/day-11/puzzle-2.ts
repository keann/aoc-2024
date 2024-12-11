import { readInputFile } from '@input'

const file = await readInputFile()
const allStones = file.trim().split(' ')
const cache = new Map<string, number>()

const blinkOnStone = (stone: string): string[] => {
	if (stone === '0') {
		return ['1']
	}

	if (stone.length % 2 === 0) {
		const half = stone.length / 2
		return [stone.slice(0, half), Number(stone.slice(half)).toString()]
	}

	return [(Number(stone) * 2024).toString()]
}

const calcStonesAfterBlinks = (stone: string, blinks: number): number => {
	const cacheKey = `${stone}-${blinks}`
	const cacheHit = cache.get(cacheKey)
	if (cacheHit) {
		return cacheHit
	}

	const stonesAfterBlink = blinkOnStone(stone)
	const blinksLeft = blinks - 1
	if (blinksLeft <= 0) {
		return stonesAfterBlink.length
	}

	const count = stonesAfterBlink.reduce((acc, stone) => acc + calcStonesAfterBlinks(stone, blinksLeft), 0)
	cache.set(cacheKey, count)

	return count
}

const result = allStones.reduce((acc, stone) => acc + calcStonesAfterBlinks(stone, 75), 0)

console.log(result)
