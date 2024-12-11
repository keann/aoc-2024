import { readInputStrings } from '@input'

const strings = await readInputStrings()

const isDiffInvalid = (diff: number) => diff === 0 || Math.abs(diff) > 3
export const isReportValid = (report: number[]): boolean => {
	const initialDiff = report[1] - report[0]

	if (isDiffInvalid(initialDiff)) {
		return false
	}

	const shouldIncrease = initialDiff > 0

	for (let i = 2; i < report.length; i++) {
		const diff = report[i] - report[i - 1]
		if (isDiffInvalid(diff) || (shouldIncrease && diff < 0) || (!shouldIncrease && diff > 0)) {
			return false
		}
	}

	return true
}

const safeReports = strings.reduce((count, string) => {
	const report = string.split(' ').map(Number)
	return isReportValid(report) ? count + 1 : count
}, 0)

console.log(safeReports)
