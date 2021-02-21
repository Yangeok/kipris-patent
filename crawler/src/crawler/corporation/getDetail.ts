import { Page } from 'playwright'

import { fromEntries } from '../../utils'

export function getCorpsFromPatents (arr: any[][]) {
  const result = arr[0]
    .map(i => JSON.parse(i.applicants))
    .reduce((acc, value) => acc.concat(value), [])
    .filter((i: any) => i.number.charAt(0) === '1' || i.number.charAt(0) === '5')

  return result
}

export async function getCorpDetailInfo (page: Page) {
  await page.waitForLoadState('domcontentloaded')
  const data = await page.evaluate(() => {
    const result = Array.from(document.querySelectorAll('.company-data.overview .rt-tbody .rt-tr')).map((i, index) => {
      if (index === 0) {
        return [(i.querySelector('.table-data.key') as HTMLElement).innerText, Array.from(i.querySelectorAll('.table-data.value span')).map(j => (j as HTMLElement).innerText)]
      }
      return (i as HTMLElement)?.innerText.split('\n')
    })
  
    return result
  })

  return fromEntries(data)
}

export async function getCorpFinancialInfo (page: Page) {
  await page.waitForLoadState('domcontentloaded')
  const data = await page.evaluate(() => {
    const result = Array.from(document.querySelectorAll('.company-data.financial .rt-tbody .rt-tr')).map(i => (i as HTMLElement)?.innerText.split('\n'))

    return result
  })

  return fromEntries(data)
}

export async function getCorpName (page: Page) {
  await page.waitForSelector('.ds.header .name')
  const data = await page.evaluate(() => {
    const result = (document.querySelector('.ds.header .name') as HTMLElement)?.innerText

    return result
  })

  return data
}

export async function getIsPublic (page: Page) {
  await page.waitForLoadState('domcontentloaded')
  const data = await page.evaluate(() => {
    const result = (document.querySelector('.ds.header .info') as HTMLElement).nextElementSibling?.innerHTML

    return result
  })

  return data
} 

export async function getCorpMarketInfo (page: Page) {
  await page.waitForLoadState('domcontentloaded')
  const data = await page.evaluate(() => {
    const result = Array.from(document.querySelectorAll('.company-data.market-info .rt-tbody .rt-tr')).map(i => (i as HTMLElement)?.innerText.split('\n'))

    return result
  })

  return fromEntries(data)
}

export async function getIncomeStatement (page: Page) {
  const arr = ['매출액', '매출원가', '매출총이익(손실)', '판매비와관리비', '영업이익(손실)', '영업외수익', '법인세비용차감전계속사업이익(손실)']

  const data = await page.evaluate(headers => {
    const years = (document.querySelector('#income-statement .rt-thead.-header .rt-tr') as HTMLElement).innerText.split('\n')
      .filter(i => !i.includes('(증권사 컨센서스 평균)'))
      .map(i => i.includes('12-31') ? i.split('-')[0] : i)

    const result = Array.from(document.querySelectorAll('#income-statement .company-financial-status-view .rt-tbody .rt-tr'))
      .map(i => (i as HTMLElement).innerText.split('\n'))
      .filter(i => headers.includes(i[0]))
      .map(i => i.slice(0, years.length))
      .reduce<any>((acc, cur) => {
        return (acc[cur[0]] = cur
          .slice(1, cur.length)
          .reverse()
          .map(i => i.replace(/\,/g, '').replace(/\-/g, '0')), acc)
      }, {})

    return result
  }, arr)

  return data
}

export async function getFinancialStatement (page: Page) {
  const arr = ['유동자산', '비유동자산', '유동부채', '비유동부채']

  const data = await page.evaluate(headers => {
    const years = (document.querySelector('#financial-statements .rt-thead.-header .rt-tr') as HTMLElement).innerText.split('\n')
      .map(i => i.includes('12-31') ? i.split('-')[0] : i)

    const result = Array.from(document.querySelectorAll('#financial-statements .company-financial-status-view .rt-tbody .rt-tr'))
      .map(i => (i as HTMLElement).innerText.split('\n'))
      .filter(i => headers.includes(i[0]))
      .map(i => i.slice(0, years.length))
      .reduce<any>((acc, cur) => {
        return (acc[cur[0]] = cur
          .slice(1, cur.length)
          .reverse()
          .map(i => i.replace(/\,/g, '').replace(/\-/g, '0')), acc)
      }, {})

    return result
  }, arr)

  return data
}