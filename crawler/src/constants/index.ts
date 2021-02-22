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
    'familyPatents' // 패밀리특허
  ]
}]

// Corporation
export const corpOutlineFields //: Array<keyof ICorpOutline>
= [
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

  'revenue_2019', // 매출액 
  'revenue_2018',
  'revenue_2017',
  'revenue_2016',
  'revenue_2015',
  
  'salesCost_2019', // 매출원가 
  'salesCost_2018',
  'salesCost_2017',
  'salesCost_2016',
  'salesCost_2015',
  
  'sellingAndAdmnstExp_2019', // 판매비와관리비 
  'sellingAndAdmnstExp_2018',
  'sellingAndAdmnstExp_2017',
  'sellingAndAdmnstExp_2016',
  'sellingAndAdmnstExp_2015',
  
  'nonOprtIncome_2019', // 영업외수익
  'nonOprtIncome_2018',
  'nonOprtIncome_2017',
  'nonOprtIncome_2016',
  'nonOprtIncome_2015',
  
  'profit_2019', // 수익
  'profit_2018',
  'profit_2017',
  'profit_2016',
  'profit_2015',
  
  'grossProfitLoss_2019', // 매출총이익(손실)
  'grossProfitLoss_2018',
  'grossProfitLoss_2017',
  'grossProfitLoss_2016',
  'grossProfitLoss_2015',
  
  'operatingProfitLoss_2019', // 영업이익(손실)
  'operatingProfitLoss_2018',
  'operatingProfitLoss_2017',
  'operatingProfitLoss_2016',
  'operatingProfitLoss_2015',
  
  'profitBeforeIncomeTaxLoss_2019', // 법인세비용차감전계속사업이익(손실)
  'profitBeforeIncomeTaxLoss_2018',
  'profitBeforeIncomeTaxLoss_2017',
  'profitBeforeIncomeTaxLoss_2016',
  'profitBeforeIncomeTaxLoss_2015',
  
  'incomeTaxExp_2019', // 계속영업손익법인세비용(부의법인세비용)
  'incomeTaxExp_2018',
  'incomeTaxExp_2017',
  'incomeTaxExp_2016',
  'incomeTaxExp_2015',
  
  'continuingOperatingProfitLoss_2019', // 계속영업이익(손실)
  'continuingOperatingProfitLoss_2018',
  'continuingOperatingProfitLoss_2017',
  'continuingOperatingProfitLoss_2016',
  'continuingOperatingProfitLoss_2015',
  
  'discontinuedOperatingProfitLoss_2019', // 중단영업이익(손실)
  'discontinuedOperatingProfitLoss_2018',
  'discontinuedOperatingProfitLoss_2017',
  'discontinuedOperatingProfitLoss_2016',
  'discontinuedOperatingProfitLoss_2015',
  
  'totalNetIncome_2019', // 총당기순이익
  'totalNetIncome_2018',
  'totalNetIncome_2017',
  'totalNetIncome_2016',
  'totalNetIncome_2015',
  
  'otherComprehensiveIncome_2019', // 기타포괄손익
  'otherComprehensiveIncome_2018',
  'otherComprehensiveIncome_2017',
  'otherComprehensiveIncome_2016',
  'otherComprehensiveIncome_2015',
  
  'comprehensiveIncome_2019', // 포괄손익
  'comprehensiveIncome_2018',
  'comprehensiveIncome_2017',
  'comprehensiveIncome_2016',
  'comprehensiveIncome_2015',

  'currentAssets_2019', // 유동자산 
  'currentAssets_2018', 
  'currentAssets_2017', 
  'currentAssets_2016', 
  'currentAssets_2015', 
  
  'nonCurrentAssets_2019', // 비유동자산 
  'nonCurrentAssets_2018',
  'nonCurrentAssets_2017',
  'nonCurrentAssets_2016',
  'nonCurrentAssets_2015',
  
  'currentLiabilities_2019', // 유동부채 
  'currentLiabilities_2018', 
  'currentLiabilities_2017', 
  'currentLiabilities_2016', 
  'currentLiabilities_2015', 
  
  'nonCurrentLiabilities_2019', // 비유동부채
  'nonCurrentLiabilities_2018',
  'nonCurrentLiabilities_2017',
  'nonCurrentLiabilities_2016',
  'nonCurrentLiabilities_2015',
  
  'totalAssets_2019', // 자산총계
  'totalAssets_2018',
  'totalAssets_2017',
  'totalAssets_2016',
  'totalAssets_2015',
  
  'totalLiabilities_2019', // 부채총계
  'totalLiabilities_2018',
  'totalLiabilities_2017',
  'totalLiabilities_2016',
  'totalLiabilities_2015',
  
  'totalEquity_2019', // 자본총계
  'totalEquity_2018',
  'totalEquity_2017',
  'totalEquity_2016',
  'totalEquity_2015',
  
  'totalLiabilitiesAndEquity_2019', // 부채와자본총계
  'totalLiabilitiesAndEquity_2018',
  'totalLiabilitiesAndEquity_2017',
  'totalLiabilitiesAndEquity_2016',
  'totalLiabilitiesAndEquity_2015',
]
export const incomeStatementFields
//: Array<keyof IIncomeStatement>
= [
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
export const financialStatementFields
//: Array<keyof IFinancialStatement> 
= [
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