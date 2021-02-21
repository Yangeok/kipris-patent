import { WriteStream } from 'fs'

// Patent
export interface IApplicationNumber {
  applicationNumber: string // 출원번호
}
export interface IBibliographic extends IApplicationNumber {
  inventionTitle: string // 발명명
  applicationDate: string | Date // 출원일자
  registerStatus: string // 등록상태
  registerNumber: string | number // 등록번호
  registerDate: string | Date // 등록일자
  publishNumber: string | number // 공개번호
  publishDate: string | Date // 공개일자
  intlApplNumber: string | number // 국제출원번호
  intlApplDate: string | Date // 국제출원일자
  intlPublishNumber: string | number // 국제공개번호
  intlPublishDate: string | Date // 국제공개일자
  claimReqDate: string | Date // 청구일자
  claimCount: string | number // 청구항수
  // astrtCont: string // 요약
  applicants?: string // 출원인 json
  // inventors?: string // 발명인 json
  // claims?: string // 청구항 json
  citatingPatents?: string // 인용특허 json
  citatedPatents?: string // 피인용특허 json
  familyPatents?: string // 패밀리특허 json
}
export interface IApplicantNumber {
  applicantNumber: string | number // 출원인번호
}
export interface IApplicant extends IApplicationNumber, IApplicantNumber {
  applicantName: string // 출원인명
  applicantNationality: string // 출원인국적
  applicantAddress: string // 출원인주소
} 
export interface IInventor extends IApplicationNumber {
  inventorName: string // 발명인명
  inventorNumber: string | number // 발명인번호
  inventorNationality: string // 발명인국적
  inventorAddress: string // 발명인주소
} 
export type IIpcCode = string
export interface IIpc extends IApplicationNumber {
  ipcCode: IIpcCode // IPC코드
  ipcDate: string | Date // IPC일자
}
export interface ICpc extends IApplicationNumber {
  cpcCode: string // CPC코드
  cpcDate: string | Date // CPC일자
}

export interface IClaim extends IApplicationNumber {
  claimDescription: string // 청구항세부
}
export interface ICitating extends IApplicationNumber {
  nationality: string // 인용특허국적
  publishNumber: string | number // 인용공개번호
  publishDate: string | Date // 인용특허공개일자
  inventionTitle: string // 인용특허명
  ipcCode: string | IIpcCode // IPC코드
}
export interface ICitated extends IApplicationNumber {
  applicationDate: string | Date // 피인용특허일자
  inventionTitle: string // 피인용특허명
  ipcCode: string | IIpcCode // IPC코드
}
export interface IFamilyPatent extends IApplicationNumber {
  number: string | number // 패밀리특허번호
  nationalityCode: string // 패밀리특허국적코드
  nationality: string // 패밀리특허국적
  type: string // 패밀리특허타입
}

// Corporation
export interface ICorpNumber {
  corpNumber: string | number // 법인번호
}
export interface ICorpOutline extends IApplicantNumber, ICorpNumber, IIncomeStatement, IFinancialStatement {
  businessNumber: string | number // 사업자번호
  repName: string // 법인대표자명
  estDate: string | Date // 법인설립일자
  address: string // 법인주소
  corpName: string // 법인명
  corpScale: string // 법인규모
  corpForm: string // 법인형태
  indCat: string // 산업분류
  nationality: string // 법인국적
  isExtAudit: string | boolean // 외감여부
  isClose: string | boolean // 폐업여부
  isPublic: string | boolean // 상장여부
}

export interface IIncomeStatement {
  revenue: string // 매출액
  salesCost: string // 매출원가
  SellingAndAdmnstExp: string // 판매비와관리비
  nonOprtIncome: string // 영업외수익
}

export interface IFinancialStatement {
  currentAssets: string // 유동자산
  nonCurrentAssets: string // 비유동자산
  currentLiabilities: string // 유동부채
  nonCurrentLiabilities: string // 비유동부채
}

// Common
export interface IFile {
  name: string
  filePath: string
  file: WriteStream
}