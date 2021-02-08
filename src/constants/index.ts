import { IIpc, ICpc, IApplicant, IBibliographic, IInventor, IClaim, ICitating, ICitated, IFamilyPatent, ICorpFinance, ICorpMarket, ICorpOutline } from '../interfaces'

// Patent
export const bibliographicFields: Array<keyof IBibliographic> = ['inventionTitle', 'applicationNumber', 'applicationDate', 'registerStatus', 'registerNumber', 'registerDate', 'astrtCont', 'claimCount']
export const ipcFields: Array<keyof IIpc> = ['applicationNumber', 'ipcCode', 'ipcDate']
export const cpcFields: Array<keyof ICpc> = ['applicationNumber', 'cpcCode', 'cpcDate']
export const applicantFields: Array<keyof IApplicant> = ['applicationNumber', 'applicantName', 'applicantNumber', 'applicantNationality', 'applicantAddress']
export const inventorFields: Array<keyof IInventor> = ['applicationNumber', 'inventorName', 'inventorNumber', 'inventorNationality', 'inventorAddress']
export const claimFields: Array<keyof IClaim> = ['applicationNumber', 'claimDescription']
export const citatingFields: Array<keyof ICitating> = ['applicationNumber', 'nationality', 'publishNumber', 'publishDate', 'inventionTitle', 'ipcCode']
export const citatedFields: Array<keyof ICitated> = ['applicationNumber', 'applicationDate', 'inventionTitle', 'ipcCode']
export const familyPatentFields: Array<keyof IFamilyPatent> = ['applicationNumber', 'failyNumber', 'nationalityCode', 'nationality', 'familyType']

// Patent files
export const patentFiles = [{
  name: 'patent-bibliographic',
  fields: bibliographicFields
}, {
  name: 'patent-ipc',
  fields: ipcFields
}, {
  name: 'patent-cpc',
  fields: cpcFields
}, {
  name: 'patent-applicant',
  fields: applicantFields
}, {
  name: 'patent-inventor',
  fields: inventorFields
}, {
  name: 'patent-claim',
  fields: claimFields
}, {
  name: 'patent-citating',
  fields: citatingFields
}, {
  name: 'patent-citated',
  fields: citatedFields
}, {
  name: 'patent-family',
  fields: familyPatentFields
}]

// Corporation
export const corpOutlineFields: Array<keyof ICorpOutline> = ['applicantNumber', 'businessNumber', 'corpNumber', 'repName', 'estDate', 'address', 'corpName', 'nationality', 'isExtAudit', 'corpScale', 'corpForm', 'indCat', 'isClose', 'isPublic', ]
export const corpMarketFields: Array<keyof ICorpMarket> = ['corpNumber', 'marketCap']
export const corpFinanceFields: Array<keyof ICorpFinance> = ['corpNumber', 'totalSales', 'bizProfits', 'crtmNetIncome', 'assets', 'liabilities', 'capital', 'employees', 'roe']

// Corporation files
export const corpFiles = [{
  name: 'corp-outline',
  fields: corpOutlineFields
}, {
  name: 'corp-finance',
  fields: corpFinanceFields
}]