import { readInputFile } from '@input'

const file = await readInputFile()
const allStones = file.trim().split(' ')

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

const calcStonesAfterBlinks = (stone: string, blinksLeft: number): number => {
	const stonesAfterBlink = blinkOnStone(stone)
	return blinksLeft - 1 > 0
		? stonesAfterBlink.reduce((acc, stone) => acc + calcStonesAfterBlinks(stone, blinksLeft - 1), 0)
		: stonesAfterBlink.length
}

const result = allStones.reduce((acc, stone) => acc + calcStonesAfterBlinks(stone, 25), 0)

console.log(result)
