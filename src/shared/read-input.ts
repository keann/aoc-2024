import path from 'node:path'

const INPUT_FILE_NAME = 'input.txt'

export const readInputFile = async () => {
	const inputPath = path.join(process.env.CWD ?? '', INPUT_FILE_NAME)
	const file = await Bun.file(inputPath).text()

	return file
}

export const readInputStrings = async () => {
	const file = await readInputFile()
	const strings = file.split('\n')

	return strings
}
