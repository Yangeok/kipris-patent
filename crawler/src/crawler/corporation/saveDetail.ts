import { currenyFormatter } from '../../utils'

export function saveCorpDetail (applicantNumber: string, res: {
    name: string
    isPublic: string | undefined
    details: any
    incomeStatement: any
    financialStatement: any
}) {
  const result = `${applicantNumber};${res.details['법인 등록번호'].replace(/\-/g, '') || ''};${res.details['사업자 등록번호'].replace(/\-/g, '') || ''};${res.details['대표이사']};${res.details['설립일자'] ? res.details['설립일자'] : ''};${res.name};${res.details['기업형태'].split(' | ')[1]};${res.details['기업형태'].split(' | ')[0] || ''};${res.details['산업분류']};${res.details['기업형태'].split(' | ')[2] || ''};${res.details['기업형태'].split(' | ')[3] || ''};${res.isPublic};${res.incomeStatement.revenue_2019 || ''};${res.incomeStatement.revenue_2018 || ''};${res.incomeStatement.revenue_2017 || ''};${res.incomeStatement.revenue_2016 || ''};${res.incomeStatement.revenue_2015 || ''};${res.incomeStatement.salesCost_2019 || ''};${res.incomeStatement.salesCost_2018 || ''};${res.incomeStatement.salesCost_2017 || ''};${res.incomeStatement.salesCost_2016 || ''};${res.incomeStatement.salesCost_2015 || ''};${res.incomeStatement.sellingAndadmnstExp_2019 || ''};${res.incomeStatement.sellingAndadmnstExp_2018 || ''};${res.incomeStatement.sellingAndadmnstExp_2017 || ''};${res.incomeStatement.sellingAndadmnstExp_2016 || ''};${res.incomeStatement.sellingAndadmnstExp_2015 || ''};${res.incomeStatement.nonOprtIncome_2019 || ''};${res.incomeStatement.nonOprtIncome_2018 || ''};${res.incomeStatement.nonOprtIncome_2017 || ''};${res.incomeStatement.nonOprtIncome_2016 || ''};${res.incomeStatement.nonOprtIncome_2015 || ''};${res.incomeStatement.profit_2019 || ''};${res.incomeStatement.profit_2018 || ''};${res.incomeStatement.profit_2017 || ''};${res.incomeStatement.profit_2016 || ''};${res.incomeStatement.profit_2015 || ''};${res.incomeStatement.grossProfitLoss_2019 || ''};${res.incomeStatement.grossProfitLoss_2018 || ''};${res.incomeStatement.grossProfitLoss_2017 || ''};${res.incomeStatement.grossProfitLoss_2016 || ''};${res.incomeStatement.grossProfitLoss_2015 || ''};${res.incomeStatement.operatingProfitLoss_2019 || ''};${res.incomeStatement.operatingProfitLoss_2018 || ''};${res.incomeStatement.operatingProfitLoss_2017 || ''};${res.incomeStatement.operatingProfitLoss_2016 || ''};${res.incomeStatement.operatingProfitLoss_2015 || ''};${res.incomeStatement.profitBeforeIncomeTaxLoss_2019 || ''};${res.incomeStatement.profitBeforeIncomeTaxLoss_2018 || ''};${res.incomeStatement.profitBeforeIncomeTaxLoss_2017 || ''};${res.incomeStatement.profitBeforeIncomeTaxLoss_2016 || ''};${res.incomeStatement.profitBeforeIncomeTaxLoss_2015 || ''};${res.incomeStatement.incomeTaxExp_2019 || ''};${res.incomeStatement.incomeTaxExp_2018 || ''};${res.incomeStatement.incomeTaxExp_2017 || ''};${res.incomeStatement.incomeTaxExp_2016 || ''};${res.incomeStatement.incomeTaxExp_2015 || ''};${res.incomeStatement.continuingOperatingProfitLoss_2019 || ''};${res.incomeStatement.continuingOperatingProfitLoss_2018 || ''};${res.incomeStatement.continuingOperatingProfitLoss_2017 || ''};${res.incomeStatement.continuingOperatingProfitLoss_2016 || ''};${res.incomeStatement.continuingOperatingProfitLoss_2015 || ''};${res.incomeStatement.discontinuedOperatingProfitLoss_2019 || ''};${res.incomeStatement.discontinuedOperatingProfitLoss_2018 || ''};${res.incomeStatement.discontinuedOperatingProfitLoss_2017 || ''};${res.incomeStatement.discontinuedOperatingProfitLoss_2016 || ''};${res.incomeStatement.discontinuedOperatingProfitLoss_2015 || ''};${res.financialStatement.currentAssets_2019 || ''};${res.financialStatement.currentAssets_2018 || ''};${res.financialStatement.currentAssets_2017 || ''};${res.financialStatement.currentAssets_2016 || ''};${res.financialStatement.currentAssets_2015 || ''};${res.financialStatement.nonCurrentAssets_2019 || ''};${res.financialStatement.nonCurrentAssets_2018 || ''};${res.financialStatement.nonCurrentAssets_2017 || ''};${res.financialStatement.nonCurrentAssets_2016 || ''};${res.financialStatement.nonCurrentAssets_2015 || ''};${res.financialStatement.currentLiabilities_2019 || ''};${res.financialStatement.currentLiabilities_2018 || ''};${res.financialStatement.currentLiabilities_2017 || ''};${res.financialStatement.currentLiabilities_2016 || ''};${res.financialStatement.currentLiabilities_2015 || ''};${res.financialStatement.nonCurrentLiabilities_2019 || ''};${res.financialStatement.nonCurrentLiabilities_2018 || ''};${res.financialStatement.nonCurrentLiabilities_2017 || ''};${res.financialStatement.nonCurrentLiabilities_2016 || ''};${res.financialStatement.nonCurrentLiabilities_2015 || ''};${res.financialStatement.totalAssets_2019 || ''};${res.financialStatement.totalAssets_2018 || ''};${res.financialStatement.totalAssets_2017 || ''};${res.financialStatement.totalAssets_2016 || ''};${res.financialStatement.totalAssets_2015 || ''};${res.financialStatement.totalLiabilities_2019 || ''};${res.financialStatement.totalLiabilities_2018 || ''};${res.financialStatement.totalLiabilities_2017 || ''};${res.financialStatement.totalLiabilities_2016 || ''};${res.financialStatement.totalLiabilities_2015 || ''};${res.financialStatement.totalEquity_2019 || ''};${res.financialStatement.totalEquity_2018 || ''};${res.financialStatement.totalEquity_2017 || ''};${res.financialStatement.totalEquity_2016 || ''};${res.financialStatement.totalEquity_2015 || ''};${res.financialStatement.totalLiabilitiesAndEquity_2019 || ''};${res.financialStatement.totalLiabilitiesAndEquity_2018 || ''};${res.financialStatement.totalLiabilitiesAndEquity_2017 || ''};${res.financialStatement.totalLiabilitiesAndEquity_2016 || ''};${res.financialStatement.totalLiabilitiesAndEquity_2015 || ''};\n`

  return result
}