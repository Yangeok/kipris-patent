import { IBibliographic, ICitating, ICitated, IFamilyPatent, ICorpOutline, IIncomeStatement, IFinancialStatement } from '../interfaces'

// Patent
export const bibliographicFields: Array<keyof IBibliographic> = [
  'inventionTitle',  // 발명명
  'applicationNumber', // 출원번호
  'applicationDate', // 출원일자
  'registerStatus', // 등록상태
  'registerNumber', // 등록번호
  'registerDate', // 등록일자
  'publishNumber', // 공개번호
  'publishDate', // 공개일자
  // 'intlApplNumber', // 국제출원번호
  // 'intlApplDate', // 국제출원일자
  // 'intlPublishNumber', // 국제공개번호
  // 'intlPublishDate', // 국제공개일자
  'claimReqDate', // 청구일자
  'claimCount', // 청구항수
  // 'astrtCont' // 요약
]
export const citatingFields: Array<keyof ICitating> = [
  'nationality', // 인용특허국적
  'publishNumber', // 인용특허공개번호
  'publishDate', // 인용특허공개일자
  'inventionTitle', // 인용특허명
  'ipcCode' // IPC코드
]
export const citatedFields: Array<keyof ICitated> = [
  'applicationDate', // 피인용특허일자 
  'inventionTitle', // 피인용특허명 
  'ipcCode' // IPC코드
]
export const familyPatentFields: Array<keyof IFamilyPatent> = [
  'number', // 패밀리특허번호 
  'nationalityCode', // 패밀리특허국적코드 
  'nationality', // 패밀리특허국적 
  'type' // 패밀리특허타입
]

// Patent files
export const patentFiles = [{
  name: 'patent',
  fields: [
    ...bibliographicFields, 
    // 'applicants', // 출원인
    'applicantNumber', // 출원인번호
    'applicantName', // 출원인명
    // 'inventors', // 발명인
    // 'claims', // 청구항
    'ipcs', // IPC
    'cpcs', // CPC
    'citatingPatents', // 인용특허
    'citatedPatents', // 피인용특허
    'familyPatents' //
  ]
}]

// Corporation
export const corpOutlineFields: Array<keyof ICorpOutline> = [
  'applicantNumber', // 출원인번호
  'corpNumber', // 법인번호
  'businessNumber', // 법인대표자명  
  'repName', // 대표자명
  'estDate', // 법인설립일자  
  'corpName', // 법인명  
  'corpScale', // 법인규모  
  'corpForm', // 법인형태  
  'indCat', // 산업분류  
  // 'nationality', // 법인국적  
  'isExtAudit', // 외감여부  
  'isClose', // 폐업여부  
  'isPublic', // 상장여부  
  'revenue',  // 매출액 
  'salesCost',  // 매출원가 
  'sellingAndAdmnstExp',  // 판매비와관리비 
  'nonOprtIncome',  // 영업외수익
  'profit',  // 수익
  'grossProfitLoss',  // 매출총이익(손실)
  'operatingProfitLoss',  // 영업이익(손실)
  'profitBeforeIncomeTaxLoss',  // 법인세비용차감전계속사업이익(손실)
  'incomeTaxExp',  // 계속영업손익법인세비용(부의법인세비용)
  'continuingOperatingProfitLoss',  // 계속영업이익(손실)
  'discontinuedOperatingProfitLoss',  // 중단영업이익(손실)
  'totalNetIncome',  // 총당기순이익
  'otherComprehensiveIncome',  // 기타포괄손익
  'comprehensiveIncome',  // 포괄손익
  'currentAssets',  // 유동자산 
  'nonCurrentAssets',  // 비유동자산 
  'currentLiabilities',  // 유동부채 
  'nonCurrentLiabilities',  // 비유동부채
  'totalAssets',  // 자산총계
  'totalLiabilities',  // 부채총계
  'totalEquity',  // 자본총계
  'totalLiabilitiesAndEquity',  // 부채와자본총계
]
export const incomeStatementFields: Array<keyof IIncomeStatement> = [
  'revenue', // 매출액 
  'salesCost', // 매출원가 
  'sellingAndAdmnstExp', // 판매비와관리비 
  'nonOprtIncome', // 영업외수익 
  'profit', // 수익
  'grossProfitLoss', // 매출총이익(손실)
  'operatingProfitLoss', // 영업이익(손실)
  'profitBeforeIncomeTaxLoss', // 법인세비용차감전계속사업이익(손실)
  'incomeTaxExp', // 계속영업손익법인세비용(부의법인세비용)
  'continuingOperatingProfitLoss', // 계속영업이익(손실)
  'discontinuedOperatingProfitLoss', // 중단영업이익(손실)
  'totalNetIncome', // 총당기순이익
  'otherComprehensiveIncome', // 기타포괄손익
  'comprehensiveIncome', // 포괄손익
]
export const financialStatementFields: Array<keyof IFinancialStatement> = [
  'currentAssets', // 유동자산 
  'nonCurrentAssets', // 비유동자산 
  'currentLiabilities', // 유동부채 
  'nonCurrentLiabilities', // 비유동부채
  'totalAssets', // 자산총계
  'totalLiabilities', // 부채총계
  'totalEquity', // 자본총계
  'totalLiabilitiesAndEquity', // 부채와자본총계
]

export const koreanIncomeStatementFields = [
  '매출액', 
  '매출원가', 
  '판매비와관리비', 
  '영업외수익', 
  '수익',
  '매출총이익(손실)',
  '영업이익(손실)',
  '법인세비용차감전계속사업이익(손실)',
  '계속영업손익법인세비용(부의법인세비용)',
  '계속영업이익(손실)',
  '중단영업이익(손실)',
  '총당기순이익',
  '기타포괄손익',
  '포괄손익',
]
export const koreanFinancialStatementFields = [
  '유동자산', 
  '비유동자산', 
  '유동부채', 
  '비유동부채',
  '자산총계',
  '부채총계',
  '자본총계',
  '부채와자본총계',
]