import { readInputStrings } from '@input'

const strings = await readInputStrings()

const calcIntermediateValues = (
	[first, second, ...rest]: number[],
	calc: (a: number, b: number) => number,
): number[] => [calc(first, second), ...rest]

const validateValues = (values: number[], result: number): boolean => {
	if (values.length === 1) {
		return values[0] === result
	}

	return (
		validateValues(
			calcIntermediateValues(values, (a, b) => a + b),
			result,
		) ||
		validateValues(
			calcIntermediateValues(values, (a, b) => a * b),
			result,
		) ||
		validateValues(
			calcIntermediateValues(values, (a, b) => Number(`${a}${b}`)),
			result,
		)
	)
}

const summary = strings.reduce((acc, string) => {
	const [result, equation] = string.split(': ')
	const resultValue = Number(result)
	const values = equation.split(' ').map(Number)

	return validateValues(values, resultValue) ? acc + resultValue : acc
}, 0)

console.log(summary)
