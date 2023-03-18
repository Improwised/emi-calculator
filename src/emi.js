/**
 * Create Loan Object with all installments and sum of interest
 *
 * @param {number} amount                   full amount of Loan
 * @param {number} installmentsNumber       number of installments
 * @param {number} interestRate             yearly interest rate in percent (8.5)
 *
 * @return {object}
 */
function Loan (amount, installmentsNumber, interestRate) {
  /** Checking params */
  if (!amount || !installmentsNumber || !interestRate) {
    throw new Error(
      `wrong parameters: ${amount} ${installmentsNumber} ${interestRate}`
    )
  }

  const installments = []
  let interestSum = 0
  let principalSum = 0
  let sum = 0

  for (let i = 0; i < installmentsNumber; i++) {
    const inst = getNextInstallment(
      amount,
      installmentsNumber,
      interestRate,
      principalSum,
      interestSum
    )

    sum += inst.installment
    principalSum += inst.principal
    interestSum += inst.interest
    /** adding lost sum on rounding */
    if (i === installmentsNumber - 1) {
      principalSum += inst.remain
      sum += inst.remain
      inst.remain = 0
    }

    installments.push(inst)
  }

  return {
    installments,
    amount: rnd(amount),
    interestSum: rnd(interestSum),
    principalSum: rnd(principalSum),
    sum: rnd(sum)
  }
}

/**
 * Method to getting next installment
 * @param {number} amount
 * @param {number} installmentsNumber
 * @param {number} interestRate
 * @param {number} principalSum
 * @param {number} interestSum
 *
 * @returns {{ principal: number, interest: number, installment: number, remain: number, interestSum: number }}
 */
const getNextInstallment = (
  amount,
  installmentsNumber,
  interestRate,
  principalSum,
  interestSum
) => {
  const monthlyInterestRate = interestRate / (12 * 100)

  const irmPow = Math.pow(1 + monthlyInterestRate, installmentsNumber)
  const installment = rnd(
    amount * ((monthlyInterestRate * irmPow) / (irmPow - 1))
  )
  const interest = rnd((amount - principalSum) * monthlyInterestRate)
  const principal = installment - interest

  return {
    principal,
    interest,
    installment,
    remain: amount - principalSum - principal,
    interestSum: interestSum + interest
  }
}

/**
 * Create Loan Object with all installments and sum of interest
 * @param {Loan}    loan     loan object
 * @param {object}  params   params
 *
 * @return {string}       html string with table
 */
function emiToHtmlTable (loan, params) {
  params = params || {}
  params.formatMoney =
    params.formatMoney ||
    function (num) {
      return num.toFixed(2)
    }
  const fm = params.formatMoney
  const html = [
    '<table class="table table-striped">' +
      '<thead>' +
      '<tr>' +
      '<th>#</th>' +
      '<th>Principal</th>' +
      '<th>Interest</th>' +
      '<th>Installment</th>' +
      '<th>Remaining Principal</th>' +
      '<th>Total Interest Paid</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>',
    '', // body content [1]
    '</tbody>' + '</table>'
  ]

  for (let i = 0; i < loan.installments.length; i++) {
    const inst = loan.installments[i]
    const instHtml =
      '<tr>' +
      '<td>' +
      (i + 1) +
      '</td>' +
      '<td>' +
      fm(inst.principal) +
      '</td>' +
      '<td>' +
      fm(inst.interest) +
      '</td>' +
      '<td>' +
      fm(inst.installment) +
      '</td>' +
      '<td>' +
      fm(inst.remain) +
      '</td>' +
      '<td>' +
      fm(inst.interestSum) +
      '</td>' +
      '</tr>'
    html[1] += instHtml
  }

  html[1] +=
    '<tfoot>' +
    '<tr>' +
    '<td>Total</td>' +
    '<td>' +
    fm(loan.principalSum) +
    '</td>' +
    '<td>' +
    fm(loan.interestSum) +
    '</td>' +
    '<td>' +
    fm(loan.sum) +
    '</td>' +
    '<td>-</td>' +
    '<td>-</td>' +
    '</tr>' +
    '</tfoot>'

  return html.join('')
}

function rnd (num) {
  return Math.round(num * 100) / 100
}

/* istanbul ignore next */
if (typeof module === 'undefined') {
  // browser
  if (!window.EMI) {
    window.EMI = {}
  }

  window.EMI.Loan = Loan
  window.EMI.emiToHtmlTable = emiToHtmlTable
} else {
  // node or browserfy
  module.exports = {
    Loan,
    emiToHtmlTable,
    rnd
  }
}
