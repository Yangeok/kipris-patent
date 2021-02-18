import { currenyFormatter } from '../../utils'

export function saveCorpDetail (i: any, res: {
    name: string
    isPublic: string | undefined
    details: any
    financials: any
}) {
  // `
  // ${i.number};
  // ${result.details['법인 등록번호'].replace(/\-/g, '')};
  // ${result.details['사업자 등록번호'].replace(/\-/g, '')};
  // ${result.details['대표이사']};
  // ${result.details['설립일자'] ? result.details['설립일자'] : ''};
  // ${result.details['지번 주소']};
  // ${result.name};
  // ${result.details['기업형태'].split(' | ')[1]};
  // ${result.details['기업형태'].split(' | ')[0]};
  // ${result.details['산업분류']};
  // ${i.nationality};
  // ${result.details['기업형태'].split(' | ')[2]};
  // ${result.details['기업형태'].split(' | ')[3] ? result.details['기업형태'].split(' | ')[3] : ''};
  // ${result.isPublic};
  // ${result.markets['시가총액'] ? result.markets['시가총액'] : ''};
  // ${result.financials['매출액'] ? currenyFormatter(result.financials['매출액'].replace(/\,/g, '')) : ''};
  // ${result.financials['당기순이익'] ? currenyFormatter(result.financials['당기순이익'].replace(/\,/g, '')) : ''};
  // ${result.financials['자산'] ? currenyFormatter(result.financials['자산'].replace(/\,/g, '')) : ''};
  // ${result.financials['부채'] ? currenyFormatter(result.financials['부채'].replace(/\,/g, '')) : ''};
  // ${result.financials['자본'] ? currenyFormatter(result.financials['자본'].replace(/\,/g, '')) : ''};
  // ${result.financials['종업원수(명)'] ? result.financials['종업원수(명)'].replace(/\,/g, '').replace('-', '') : ''};
  // \n
  // `

  return `${i.number};${res.details['법인 등록번호'].replace(/\-/g, '')};${res.details['사업자 등록번호'].replace(/\-/g, '')};${res.details['대표이사']};${res.details['설립일자'] ? res.details['설립일자'] : ''};${res.details['지번 주소']};${res.name};${res.details['기업형태'].split(' | ')[1]};${res.details['기업형태'].split(' | ')[0]};${res.details['산업분류']};${i.nationality};${res.details['기업형태'].split(' | ')[2]};${res.details['기업형태'].split(' | ')[3] ? res.details['기업형태'].split(' | ')[3] : ''};${res.isPublic};${res.financials['매출액'] ? currenyFormatter(res.financials['매출액'].replace(/\,/g, '')) : ''};${res.financials['당기순이익'] ? currenyFormatter(res.financials['당기순이익'].replace(/\,/g, '')) : ''};${res.financials['자산'] ? currenyFormatter(res.financials['자산'].replace(/\,/g, '')) : ''};${res.financials['부채'] ? currenyFormatter(res.financials['부채'].replace(/\,/g, '')) : ''};${res.financials['자본'] ? currenyFormatter(res.financials['자본'].replace(/\,/g, '')) : ''};${res.financials['종업원수(명)'] ? res.financials['종업원수(명)'].replace(/\,/g, '').replace('-', '') : ''};\n`
}