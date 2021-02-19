import { IBibliographic, ICitating, ICitated, IFamilyPatent, ICorpFinance, ICorpOutline } from '../interfaces'

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
export const corpOutlineFields: Array<keyof ICorpOutline> = ['applicantNumber', 'corpNumber', 'businessNumber', 'repName', 'estDate', 'address', 'corpName', 'corpScale', 'corpForm', 'indCat', 'nationality', 'isExtAudit', 'isClose', 'isPublic', 'bizProfits', 'crtmNetIncome', 'assets', 'liabilities', 'capital', 'employees', 'totalSales', 'bizProfits', 'crtmNetIncome', 'assets', 'liabilities', 'capital', 'employees']
export const corpFinanceDetailFields: Array<keyof ICorpFinance> = ['corpNumber', 'applicantNumber', 'bs', 'incoStat']
// ['corpNumber', 'totalAssets', 'currentAssets', 'currentLiabilities', 'totalEquity', 'issuedCapital', 'totalLiabilities', 'nonCurrentAsset', 'nonCurrentLiabilities', 'earningSurplus', 'operatingIncome', 'profit', 'profitBeforeTax', 'revenue']