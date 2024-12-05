import { readInputSectionStrings } from '@input'

const [rules, updates] = await readInputSectionStrings()
const rulesMap = new Map<string, Set<string>>()
let result = 0

for (const rule of rules) {
	const [pageX, pageY] = rule.split('|')
	const restrictedSubseqPages = rulesMap.get(pageY) ?? new Set()
	restrictedSubseqPages.add(pageX)
	rulesMap.set(pageY, restrictedSubseqPages)
}

const validatePages = (pages: string[]) => {
	for (let i = 0; i < pages.length - 1; i++) {
		const page = pages[i]
		const restrictedSubseqPages = rulesMap.get(page)

		if (!restrictedSubseqPages) {
			return true
		}

		for (let j = i + 1; j < pages.length; j++) {
			const subSeqPage = pages[j]
			if (restrictedSubseqPages.has(subSeqPage)) {
				return false
			}
		}
	}

	return true
}

for (const update of updates) {
	const pages = update.split(',')
	const updateIsValid = validatePages(pages)

	if (updateIsValid) {
		const middlePage = pages[Math.floor(pages.length / 2)]
		result += Number(middlePage)
	}
}

console.log(result)
