import { currenyFormatter } from '../../utils'

export function saveCorpDetail (applicantNumber: string, res: {
    name: string
    isPublic: string | undefined
    details: any
    incomeStatement: any
    financialStatement: any
}) {
  // `${applicantNumber};
  // ${res.details['법인 등록번호'].replace(/\-/g, '')};
  // ${res.details['사업자 등록번호'].replace(/\-/g, '')};
  // ${res.details['대표이사']};
  // ${res.details['설립일자'] ? res.details['설립일자'] : ''};
  // ${res.name};
  // ${res.details['기업형태'].split(' | ')[1]};
  // ${res.details['기업형태'].split(' | ')[0]};
  // ${res.details['산업분류']};
  // ${res.details['기업형태'].split(' | ')[2]};
  // ${res.details['기업형태'].split(' | ')[3] ? res.details['기업형태'].split(' | ')[3] : ''};
  // ${res.isPublic};
  // ${JSON.stringify(res.incomeStatement['매출액'] ? res.incomeStatement['매출액'] : [])};
  // ${JSON.stringify(res.incomeStatement['매출원가'] ? res.incomeStatement['매출원가'] : [])};
  // ${JSON.stringify(res.incomeStatement['판매비와관리비'] ? res.incomeStatement['판매비와관리비'] : [])};
  // ${JSON.stringify(res.incomeStatement['영업외수익'] ? res.incomeStatement['영업외수익'] : [])};
  // ${JSON.stringify(res.incomeStatement['수익'] ? res.incomeStatement['수익'] : [])};
  // ${JSON.stringify(res.incomeStatement['매출총이익(손실)'] ? res.incomeStatement['매출총이익(손실)'] : [])};
  // ${JSON.stringify(res.incomeStatement['영업이익(손실)'] ? res.incomeStatement['영업이익(손실)'] : [])};
  // ${JSON.stringify(res.incomeStatement['법인세비용차감전계속사업이익(손실)'] ? res.incomeStatement['법인세비용차감전계속사업이익(손실)'] : [])};
  // ${JSON.stringify(res.incomeStatement['계속영업손익법인세비용(부의법인세비용)'] ? res.incomeStatement['계속영업손익법인세비용(부의법인세비용)'] : [])};
  // ${JSON.stringify(res.incomeStatement['계속영업이익(손실)'] ? res.incomeStatement['계속영업이익(손실)'] : [])};
  // ${JSON.stringify(res.incomeStatement['중단영업이익(손실)'] ? res.incomeStatement['중단영업이익(손실)'] : [])};
  // ${JSON.stringify(res.incomeStatement['총당기순이익'] ? res.incomeStatement['총당기순이익'] : [])};
  // ${JSON.stringify(res.incomeStatement['기타포괄손익'] ? res.incomeStatement['기타포괄손익'] : [])};
  // ${JSON.stringify(res.incomeStatement['포괄손익'] ? res.incomeStatement['포괄손익'] : [])};
  // ${JSON.stringify(res.financialStatement['유동자산'] ? res.financialStatement['유동자산'] : [])};
  // ${JSON.stringify(res.financialStatement['비유동자산'] ? res.financialStatement['비유동자산'] : [])};
  // ${JSON.stringify(res.financialStatement['유동부채'] ? res.financialStatement['유동부채'] : [])};
  // ${JSON.stringify(res.financialStatement['비유동부채'] ? res.financialStatement['비유동부채'] : [])};
  // ${JSON.stringify(res.financialStatement['자산총계'] ? res.financialStatement['자산총계'] : [])};
  // ${JSON.stringify(res.financialStatement['부채총계'] ? res.financialStatement['부채총계'] : [])};
  // ${JSON.stringify(res.financialStatement['자본총계'] ? res.financialStatement['자본총계'] : [])};
  // ${JSON.stringify(res.financialStatement['부채와자본총계'] ? res.financialStatement['부채와자본총계'] : [])};
  // \n`

  return `${applicantNumber};${res.details['법인 등록번호'].replace(/\-/g, '')};${res.details['사업자 등록번호'].replace(/\-/g, '')};${res.details['대표이사']};${res.details['설립일자'] ? res.details['설립일자'] : ''};${res.name};${res.details['기업형태'].split(' | ')[1]};${res.details['기업형태'].split(' | ')[0]};${res.details['산업분류']};${res.details['기업형태'].split(' | ')[2]};${res.details['기업형태'].split(' | ')[3] ? res.details['기업형태'].split(' | ')[3] : ''};${res.isPublic};${JSON.stringify(res.incomeStatement['매출액'] ? res.incomeStatement['매출액'] : [])};${JSON.stringify(res.incomeStatement['매출원가'] ? res.incomeStatement['매출원가'] : [])};${JSON.stringify(res.incomeStatement['판매비와관리비'] ? res.incomeStatement['판매비와관리비'] : [])};${JSON.stringify(res.incomeStatement['영업외수익'] ? res.incomeStatement['영업외수익'] : [])};${JSON.stringify(res.incomeStatement['수익'] ? res.incomeStatement['수익'] : [])};${JSON.stringify(res.incomeStatement['매출총이익(손실)'] ? res.incomeStatement['매출총이익(손실)'] : [])};${JSON.stringify(res.incomeStatement['영업이익(손실)'] ? res.incomeStatement['영업이익(손실)'] : [])};${JSON.stringify(res.incomeStatement['법인세비용차감전계속사업이익(손실)'] ? res.incomeStatement['법인세비용차감전계속사업이익(손실)'] : [])};${JSON.stringify(res.incomeStatement['계속영업손익법인세비용(부의법인세비용)'] ? res.incomeStatement['계속영업손익법인세비용(부의법인세비용)'] : [])};${JSON.stringify(res.incomeStatement['계속영업이익(손실)'] ? res.incomeStatement['계속영업이익(손실)'] : [])};${JSON.stringify(res.incomeStatement['중단영업이익(손실)'] ? res.incomeStatement['중단영업이익(손실)'] : [])};${JSON.stringify(res.incomeStatement['총당기순이익'] ? res.incomeStatement['총당기순이익'] : [])};${JSON.stringify(res.incomeStatement['기타포괄손익'] ? res.incomeStatement['기타포괄손익'] : [])};${JSON.stringify(res.incomeStatement['포괄손익'] ? res.incomeStatement['포괄손익'] : [])};${JSON.stringify(res.financialStatement['유동자산'] ? res.financialStatement['유동자산'] : [])};${JSON.stringify(res.financialStatement['비유동자산'] ? res.financialStatement['비유동자산'] : [])};${JSON.stringify(res.financialStatement['유동부채'] ? res.financialStatement['유동부채'] : [])};${JSON.stringify(res.financialStatement['비유동부채'] ? res.financialStatement['비유동부채'] : [])};${JSON.stringify(res.financialStatement['자산총계'] ? res.financialStatement['자산총계'] : [])};${JSON.stringify(res.financialStatement['부채총계'] ? res.financialStatement['부채총계'] : [])};${JSON.stringify(res.financialStatement['자본총계'] ? res.financialStatement['자본총계'] : [])};${JSON.stringify(res.financialStatement['부채와자본총계'] ? res.financialStatement['부채와자본총계'] : [])};\n`
}