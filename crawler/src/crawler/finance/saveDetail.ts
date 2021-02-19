export function saveFinanceDetail ({
  corpNumber, applicantNumber
}: {
  corpNumber: string
  applicantNumber: string
}, {
  bs, incoStat
}: {
  bs: any
  incoStat: any
}) {
  return `${corpNumber};${applicantNumber};${JSON.stringify(bs)};${JSON.stringify(incoStat)}\n`
}