import { IIpc, ICpc, IApplicant, IBibliographic, IInventor, IClaim, ICitating, ICitated, IFamilyPatent, ICorpFinance, ICorpMarket, ICorpOutline } from '../interfaces'

// Patent
export const bibliographicFields: Array<keyof IBibliographic> = ['inventionTitle', 'applicationNumber', 'applicationDate', 'registerStatus', 'registerNumber', 'registerDate', 'publishNumber', 'publishDate', 'intlApplNumber', 'intlApplDate', 'intlPublishNumber', 'intlPublishDate', 'claimReqDate', 'claimCount', 'astrtCont']
// export const ipcFields: Array<keyof IIpc> = ['ipcCode', 'ipcDate']
// export const cpcFields: Array<keyof ICpc> = ['cpcCode', 'cpcDate']
// export const applicantFields: Array<keyof IApplicant> = ['applicantName', 'applicantNumber', 'applicantNationality', 'applicantAddress']
// export const inventorFields: Array<keyof IInventor> = ['inventorName', 'inventorNumber', 'inventorNationality', 'inventorAddress']
// export const claimFields: Array<keyof IClaim> = ['claimDescription']
export const citatingFields: Array<keyof ICitating> = ['nationality', 'publishNumber', 'publishDate', 'inventionTitle', 'ipcCode']
export const citatedFields: Array<keyof ICitated> = ['applicationDate', 'inventionTitle', 'ipcCode']
export const familyPatentFields: Array<keyof IFamilyPatent> = ['number', 'nationalityCode', 'nationality', 'type']

// Patent files
export const patentFiles = [{
  name: 'patent',
  fields: [...bibliographicFields, 'applicants', 'inventors', 'claims', 'ipcs', 'cpcs', 'citatingPatents', 'citatedPatents', 'familyPatents']
}]

// Corporation
export const corpOutlineFields: Array<keyof ICorpOutline> = ['applicantNumber', 'corpNumber', 'businessNumber', 'repName', 'estDate', 'address', 'corpName', 'corpScale', 'corpForm', 'indCat', 'nationality', 'isExtAudit', 'isClose', 'isPublic', 'bizProfits', 'crtmNetIncome', 'assets', 'liabilities', 'capital', 'employees']
// export const corpMarketFields: Array<keyof ICorpMarket> = ['corpNumber', 'marketCap']
export const corpFinanceFields: Array<keyof ICorpFinance> = ['totalSales', 'bizProfits', 'crtmNetIncome', 'assets', 'liabilities', 'capital', 'employees']

// Corporation files
export const corpFiles = [{
  name: 'corp-outline',
  fields: [...corpOutlineFields, ...corpFinanceFields]
}]