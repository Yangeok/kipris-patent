import { IIpc, ICpc, IApplicant, IBibliographic, IInventor, IClaim, ICitating, ICitated, IFamilyPatent, ICorpFinance, ICorpMarket, ICorpOutline } from '../interfaces'

// Patent
export const bibliographicFields: Array<keyof IBibliographic> = ['inventionTitle', 'applicationNumber', 'applicationDate', 'registerStatus', 'registerNumber', 'registerDate', 'publishNumber', 'publishDate', 'intlApplNumber', 'intlApplDate', 'intlPublishNumber', 'intlPublishDate', 'claimReqDate', 'claimCount', 'astrtCont']
export const ipcFields: Array<keyof IIpc> = ['ipcCode', 'ipcDate']
export const cpcFields: Array<keyof ICpc> = ['cpcCode', 'cpcDate']
export const applicantFields: Array<keyof IApplicant> = ['applicantName', 'applicantNumber', 'applicantNationality', 'applicantAddress']
export const inventorFields: Array<keyof IInventor> = ['inventorName', 'inventorNumber', 'inventorNationality', 'inventorAddress']
export const claimFields: Array<keyof IClaim> = ['claimDescription']
export const citatingFields: Array<keyof ICitating> = ['nationality', 'publishNumber', 'publishDate', 'inventionTitle', 'ipcCode']
export const citatedFields: Array<keyof ICitated> = ['applicationDate', 'inventionTitle', 'ipcCode']
export const familyPatentFields: Array<keyof IFamilyPatent> = ['failyNumber', 'nationalityCode', 'nationality', 'familyType']

// Patent files
export const patentFiles = [{
  name: 'patent',
  fields: [...bibliographicFields, 'applicants', 'inventors', 'claims', 'ipcs', 'cpcs', 'citatingPatents', 'citatedPatents', 'familyPatents']
}, {
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