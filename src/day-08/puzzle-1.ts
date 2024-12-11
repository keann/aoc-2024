import { readInputStrings } from '@input'

const strings = await readInputStrings()

const Y_MAX = strings.length - 1
const X_MAX = strings[0].length - 1

type Coords = { x: number; y: number }
const getFrequencyAt = ({ x, y }: Coords) => strings[y]?.[x]
const coordsExist = ({ x, y }: Coords) => x >= 0 && y >= 0 && x <= X_MAX && y <= Y_MAX

const frequenciesMap = new Map<string, Coords[]>()
const antinodes = new Set<string>()

const findAntinodes = (coords1: Coords, coords2: Coords) => {
	const diff = { x: coords2.x - coords1.x, y: coords2.y - coords1.y }
	const antinodesCoords = [
		{ x: coords1.x - diff.x, y: coords1.y - diff.y },
		{ x: coords2.x + diff.x, y: coords2.y + diff.y },
	].filter(coordsExist)

	for (const { x, y } of antinodesCoords) {
		antinodes.add(`${x},${y}`)
	}
}

for (let y = 0; y <= Y_MAX; y++) {
	for (let x = 0; x <= X_MAX; x++) {
		const freq = getFrequencyAt({ x, y })

		if (freq === '.') {
			continue
		}

		const freqCoordsArray = frequenciesMap.get(freq) ?? []
		freqCoordsArray.push({ x, y })
		frequenciesMap.set(freq, freqCoordsArray)
	}
}

for (const [, freqCoordsArray] of frequenciesMap) {
	for (let i = 0; i < freqCoordsArray.length - 1; i++) {
		for (let j = i + 1; j < freqCoordsArray.length; j++) {
			findAntinodes(freqCoordsArray[i], freqCoordsArray[j])
		}
	}
}

console.log(antinodes.size)
