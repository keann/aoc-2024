import path from 'node:path'

export const readInputStrings = async (inputFileName = 'input.txt') => {
	const inputPath = path.join(import.meta.dir, inputFileName)
	const file = await Bun.file(inputPath).text()
	const strings = file.split('\n')

	return strings
}
