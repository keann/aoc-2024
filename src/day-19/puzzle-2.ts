import { readInputSectionStrings } from '@input'

const [towelList, designs] = await readInputSectionStrings()
const towels = towelList[0].split(', ')
const counted = new Map<string, number>()

const countDesignOptions = (design: string): number => {
	if (counted.has(design)) return counted.get(design) as number

	const count = towels.reduce((acc, towel) => {
		if (!design.startsWith(towel)) return acc
		if (design.length === towel.length) return acc + 1

		return acc + countDesignOptions(design.slice(towel.length))
	}, 0)

	counted.set(design, count)
	return count
}

const allDesignOptionsCount = designs.reduce((acc, design) => acc + countDesignOptions(design), 0)
console.log(allDesignOptionsCount)
