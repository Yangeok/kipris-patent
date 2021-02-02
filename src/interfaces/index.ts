export interface IApplicant {
  name: string
  number: string | number
  nationality: string
  address: string
} 

export interface IInventor {
  name: string
  number: string | number
  nationality: string
  address: string
} 

export type IIpcCode = string
export interface IIpc {
  ipcCode: string | IIpcCode
  ipcDate?: string | Date
  // TODO: 
  code?: string
  date?: string | Date
}

export interface ICpc {
  cpcCode: string
  cpcDate?: string | Date
  // TODO: 
  code?: string
  date?: string | Date
}

export type IClaim = string

export interface ICitating {
  nationality: string
  publishNumber: string | number
  publishDate: string | Date
  inventionTitle: string
  ipcCode: string | IIpcCode
}
export interface ICitated {
  applicationNumber: string | number
  applicationDate: string | Date
  inventionTitle: string
  ipcCode: string | IIpcCode
}

export interface IFamilyPatent {
  failyNumber: string | number
  nationalityCode: string
  nationality: string
  failyType: string
}

export interface IPatentInfo {
  inventionTitle: string
  applicationNumber: string | number
  applicationDate: string | Date
  registerStatus: string
  applicants: string | IApplicant[] // json
  inventors: string | IInventor[] // json
  registerNumber: string | number
  registerDate: string | Date
  astrtCont: string
  ipcs: string | IIpc[] // json
  cpcs: string | ICpc[] // json
  claims: string | IClaim[] // json
  claimCou: string | number
  citating: string | ICitating[] // json
  citated: string | ICitated[] // json
  familyPatents: string | IFamilyPatent[] // json
}

export interface ICorpInfo {
  registrationNumber: string
  corporateNumber: string | number
  repName: string | string[]
  estDate: string | Date
}