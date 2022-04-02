const EMI = require('../src/emi.js')

test('Loan is defined', () => {
  expect(EMI.Loan).toBeDefined()
})

test('Should calculate correct EMI installments', () => {
  const loan = EMI.Loan(10000, 12, 10)

  expect(loan).toBeDefined()
  expect(loan.installments.length).toBe(12)
  expect(loan.installments[0].installment).toBe(879.16)
  expect(loan.installments[12 - 1].installment).toBe(879.16)
  expect(loan.amount).toBe(10000)
  expect(loan.principalSum).toBe(10000)
  expect(loan.interestSum).toBe(549.89)
  expect(loan.sum).toBe(10549.89)

  expect(EMI.rnd(loan.principalSum + loan.interestSum)).toBe(loan.sum)
})
test('Should throw an error on negative interest rate', () => {
  expect(() => EMI.Loan(10000, -1, 10)).toThrowError('wrong parameters: 10000 -1 10')
})
