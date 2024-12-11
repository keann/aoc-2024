import { readInputStrings } from '@input'
import { isReportValid } from './puzzle-1'

const strings = await readInputStrings()

const safeReports = strings.reduce((count, string) => {
	const report = string.split(' ').map(Number)

	if (isReportValid(report)) return count + 1

	for (let i = 0; i < report.length; i++) {
		const subreport = [...report]
		subreport.splice(i, 1)

		if (isReportValid(subreport)) {
			return count + 1
		}
	}

	return count
}, 0)

console.log(safeReports)
