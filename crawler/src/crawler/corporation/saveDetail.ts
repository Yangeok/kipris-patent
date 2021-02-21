import { currenyFormatter } from '../../utils'

export function saveCorpDetail (i: any, res: {
    name: string
    isPublic: string | undefined
    details: any
    incomeStatement: any
    financialStatement: any
}) {
  // `${i.number};${res.details['법인 등록번호'].replace(/\-/g, '')};
  // ${res.details['사업자 등록번호'].replace(/\-/g, '')};
  // ${res.details['대표이사']};
  // ${res.details['설립일자'] ? res.details['설립일자'] : ''};
  // ${res.name};
  // ${res.details['기업형태'].split(' | ')[1]};
  // ${res.details['기업형태'].split(' | ')[0]};
  // ${res.details['산업분류']};
  // ${i.nationality};
  // ${res.details['기업형태'].split(' | ')[2]};
  // ${res.details['기업형태'].split(' | ')[3] ? res.details['기업형태'].split(' | ')[3] : ''};
  // ${res.isPublic};
  // ${JSON.stringify(res.incomeStatement['매출액'] ? res.incomeStatement['매출액'] : [])};
  // ${JSON.stringify(res.incomeStatement['매출원가'] ? res.incomeStatement['매출원가'] : [])};
  // ${JSON.stringify(res.incomeStatement['판매비와관리비'] ? res.incomeStatement['판매비와관리비'] : [])};
  // ${JSON.stringify(res.incomeStatement['영업외수익'] ? res.incomeStatement['영업외수익'] : [])};
  // ${JSON.stringify(res.financialStatement['유동자산'] ? res.financialStatement['유동자산'] : [])};
  // ${JSON.stringify(res.financialStatement['비유동자산'] ? res.financialStatement['비유동자산'] : [])};
  // ${JSON.stringify(res.financialStatement['유동부채'] ? res.financialStatement['유동부채'] : [])};
  // ${JSON.stringify(res.financialStatement['비유동부채'] ? res.financialStatement['비유동부채'] : [])};
  // \n`

  return `${i.number};${res.details['법인 등록번호'].replace(/\-/g, '')};${res.details['사업자 등록번호'].replace(/\-/g, '')};${res.details['대표이사']};${res.details['설립일자'] ? res.details['설립일자'] : ''};${res.name};${res.details['기업형태'].split(' | ')[1]};${res.details['기업형태'].split(' | ')[0]};${res.details['산업분류']};${i.nationality};${res.details['기업형태'].split(' | ')[2]};${res.details['기업형태'].split(' | ')[3] ? res.details['기업형태'].split(' | ')[3] : ''};${res.isPublic};${JSON.stringify(res.incomeStatement['매출액'] ? res.incomeStatement['매출액'] : [])};${JSON.stringify(res.incomeStatement['매출원가'] ? res.incomeStatement['매출원가'] : [])};${JSON.stringify(res.incomeStatement['판매비와관리비'] ? res.incomeStatement['판매비와관리비'] : [])};${JSON.stringify(res.incomeStatement['영업외수익'] ? res.incomeStatement['영업외수익'] : [])};${JSON.stringify(res.financialStatement['유동자산'] ? res.financialStatement['유동자산'] : [])};${JSON.stringify(res.financialStatement['비유동자산'] ? res.financialStatement['비유동자산'] : [])};${JSON.stringify(res.financialStatement['유동부채'] ? res.financialStatement['유동부채'] : [])};${JSON.stringify(res.financialStatement['비유동부채'] ? res.financialStatement['비유동부채'] : [])};\n`
}