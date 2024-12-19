import { readInputSectionStrings } from '@input'

const [towelList, designs] = await readInputSectionStrings()
const towels = towelList[0].split(', ')

const verifyDesign = (design: string): boolean => {
	if (!design.length) return true

	for (const towel of towels) {
		if (!design.startsWith(towel)) continue
		if (verifyDesign(design.slice(towel.length))) return true
	}

	return false
}

const possibleDesigns = designs.filter(verifyDesign)
console.log(possibleDesigns.length)
