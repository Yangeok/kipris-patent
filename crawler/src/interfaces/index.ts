import { WriteStream } from 'fs'

// Patent
export interface IApplicationNumber {
  applicationNumber: string
}
export interface IBibliographic extends IApplicationNumber {
  inventionTitle: string
  applicationDate: string | Date
  registerStatus: string
  registerNumber: string | number
  registerDate: string | Date
  publishNumber: string | number
  publishDate: string | Date
  intlApplNumber: string | number
  intlApplDate: string | Date
  intlPublishNumber: string | number
  intlPublishDate: string | Date
  claimReqDate: string | Date
  claimCount: string | number
  astrtCont: string

  applicants?: string // json
  inventors?: string // json
  claims?: string // json
  citatingPatents?: string // json
  citatedPatents?: string // json
  familyPatents?: string // json
}
export interface IApplicantNumber {
  applicantNumber: string | number
}
export interface IApplicant extends IApplicationNumber, IApplicantNumber {
  applicantName: string
  applicantNationality: string
  applicantAddress: string
} 
export interface IInventor extends IApplicationNumber {
  inventorName: string
  inventorNumber: string | number
  inventorNationality: string
  inventorAddress: string
} 
export type IIpcCode = string
export interface IIpc extends IApplicationNumber {
  ipcCode: IIpcCode
  ipcDate: string | Date
}
export interface ICpc extends IApplicationNumber {
  cpcCode: string
  cpcDate: string | Date
}

export interface IClaim extends IApplicationNumber {
  claimDescription: string
}
export interface ICitating extends IApplicationNumber {
  nationality: string
  publishNumber: string | number
  publishDate: string | Date
  inventionTitle: string
  ipcCode: string | IIpcCode
}
export interface ICitated extends IApplicationNumber {
  applicationDate: string | Date
  inventionTitle: string
  ipcCode: string | IIpcCode
}
export interface IFamilyPatent extends IApplicationNumber {
  number: string | number
  nationalityCode: string
  nationality: string
  type: string
}

// Corporation
export interface ICorpNumber {
  corpNumber: string | number
}
export interface ICorpOutline extends IApplicantNumber, ICorpNumber {
  businessNumber: string | number
  repName: string
  estDate: string | Date
  address: string
  corpName: string
  corpScale: string
  corpForm: string
  indCat: string
  nationality: string
  isExtAudit: string | boolean
  isClose: string | boolean
  isPublic: string | boolean
  totalSales: string | number
  bizProfits: string | number
  crtmNetIncome: string | number
  assets: string | number
  liabilities: string | number
  capital: string | number
  employees: string | number
}

export interface ICorpFinance extends ICorpNumber, IApplicantNumber {
  bs: string // json
  incoStat: string // json
  // totalAssets: string // json 
  // currentAssets: string // json
  // currentLiabilities: string // json
  // totalEquity: string // json
  // issuedCapital: string // json
  // totalLiabilities: string // json
  // nonCurrentAsset: string // json
  // nonCurrentLiabilities: string // json
  // earningSurplus: string // json
  // operatingIncome: string // json
  // profit: string // json
  // profitBeforeTax: string // json
  // revenue: string // json
}

// Common
export interface IFile {
  name: string
  filePath: string
  file: WriteStream
}