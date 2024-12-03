import { readInputFile } from '@input'

const file = await readInputFile()
const matches = file.matchAll(/(?<action>mul\((\d{1,3}),(\d{1,3})\))|(?<enable>do\(\))|(?<disable>don't\(\))/g)

let countEnabled = true
let result = 0

for (const match of matches) {
	if (!match.groups) continue

	const actionFound = Boolean(match.groups.action)
	const shouldEnable = Boolean(match.groups.enable)
	const shouldDisable = Boolean(match.groups.disable)

	if (!countEnabled) {
		if (shouldEnable) countEnabled = true
		continue
	}

	if (shouldDisable) {
		countEnabled = false
		continue
	}

	if (actionFound) {
		const [a, b] = match.slice(2, 4).map(Number)
		result += a * b
	}
}

console.log(result)
