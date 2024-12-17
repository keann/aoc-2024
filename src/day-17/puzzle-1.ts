import { readInputSectionStrings } from '@input'

const [registersStrings, programStrings] = await readInputSectionStrings()

const program = programStrings[0].split(': ')[1].split(',').map(Number)
const registers = ['A', 'B', 'C'].reduce<Record<string, number>>((acc, registersName, index) => {
	const value = registersStrings[index].split(': ')[1]
	acc[registersName] = Number(value)
	return acc
}, {})
const getComboOperand = (operand: number) => {
	switch (operand) {
		case 4:
			return registers.A
		case 5:
			return registers.B
		case 6:
			return registers.C
		default:
			return operand
	}
}

const result: number[] = []
let pointer = 0

while (pointer < program.length) {
	const opcode = program[pointer]
	const operand = program[pointer + 1]
	const comboOperand = getComboOperand(operand)
	let shouldIncPointer = true

	switch (opcode) {
		case 0: {
			registers.A = Math.floor(registers.A / 2 ** comboOperand)
			break
		}

		case 1: {
			registers.B = registers.B ^ operand
			break
		}

		case 2: {
			registers.B = comboOperand % 8
			break
		}

		case 3: {
			if (registers.A !== 0) {
				pointer = operand
				shouldIncPointer = false
			}
			break
		}

		case 4: {
			registers.B = registers.B ^ registers.C
			break
		}

		case 5: {
			result.push(comboOperand % 8)
			break
		}

		case 6: {
			registers.B = Math.floor(registers.A / 2 ** comboOperand)
			break
		}

		case 7: {
			registers.C = Math.floor(registers.A / 2 ** comboOperand)
			break
		}
	}

	if (shouldIncPointer) {
		pointer += 2
	}
}

console.log(result.join(','))
