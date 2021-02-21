import { IBibliographic, ICitating, ICitated, IFamilyPatent, ICorpOutline, IIncomeStatement, IFinancialStatement } from '../interfaces'

// Patent
export const bibliographicFields: Array<keyof IBibliographic> = ['inventionTitle', 'applicationNumber', 'applicationDate', 'registerStatus', 'registerNumber', 'registerDate', 'publishNumber', 'publishDate', 'intlApplNumber', 'intlApplDate', 'intlPublishNumber', 'intlPublishDate', 'claimReqDate', 'claimCount', 'astrtCont']
export const citatingFields: Array<keyof ICitating> = ['nationality', 'publishNumber', 'publishDate', 'inventionTitle', 'ipcCode']
export const citatedFields: Array<keyof ICitated> = ['applicationDate', 'inventionTitle', 'ipcCode']
export const familyPatentFields: Array<keyof IFamilyPatent> = ['number', 'nationalityCode', 'nationality', 'type']

// Patent files
export const patentFiles = [{
  name: 'patent',
  fields: [...bibliographicFields, 'applicants', 'applicantNumber', 'inventors', 'claims', 'ipcs', 'cpcs', 'citatingPatents', 'citatedPatents', 'familyPatents']
}]

// Corporation
export const corpOutlineFields: Array<keyof ICorpOutline> = ['applicantNumber', 'corpNumber', 'businessNumber', 'repName', 'estDate', 'address', 'corpName', 'corpScale', 'corpForm', 'indCat', 'nationality', 'isExtAudit', 'isClose', 'isPublic',  'revenue', 'salesCost', 'SellingAndAdmnstExp', 'nonOprtIncome', 'currentAssets', 'nonCurrentAssets', 'currentLiabilities', 'nonCurrentLiabilities']
export const incomeStatementFields: Array<keyof IIncomeStatement> = ['revenue', 'salesCost', 'SellingAndAdmnstExp', 'nonOprtIncome']
export const financialStatementFields: Array<keyof IFinancialStatement> = ['currentAssets', 'nonCurrentAssets', 'currentLiabilities', 'nonCurrentLiabilities']