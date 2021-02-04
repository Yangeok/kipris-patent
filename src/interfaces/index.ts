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
  astrtCont: string
  claimCount: string | number
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
  failyNumber: string | number
  nationalityCode: string
  nationality: string
  failyType: string
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
}
export interface ICorpMarket extends ICorpNumber {
  marketCap: string | number
}
export interface ICorpFinance extends ICorpNumber {
  totalSales: string | number
  bizProfits: string | number
  crtmNetIncome: string | number
  assets: string | number
  liabilities: string | number
  capital: string | number
  roe: string | number
  employees: string | number
}