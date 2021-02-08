import { Page } from 'playwright'
import { fromEntries } from '../../utils'

export async function getCorpDetailInfo (page: Page) {
  const data = await page.evaluate(() => {
    const result = Array.from(document.querySelectorAll('.company-data.overview .rt-tbody .rt-tr')).map((i, index) => {
      if (index === 0) {
        return [(i.querySelector('.table-data.key') as HTMLElement).innerText, Array.from(i.querySelectorAll('.table-data.value span')).map(j => (j as HTMLElement).innerText)]
      }
      return (i as HTMLElement).innerText.split('\n')
    })
  
    return result
  })

  return fromEntries(data)
}

export async function getCorpFinancialInfo (page: Page) {
  const data = await page.evaluate(() => {
    const result = Array.from(document.querySelectorAll('.company-data.financial .rt-tbody .rt-tr')).map(i => (i as HTMLElement).innerText.split('\n'))

    return result
  })

  return fromEntries(data)
}

export async function getCorpName (page: Page) {
  const data = await page.evaluate(() => {
    const result = (document.querySelector('.ds.header .name') as HTMLElement).innerText

    return result
  })

  return data
}

export async function getIsPublic (page: Page) {
  const data = await page.evaluate(() => {
    const result = (document.querySelector('.ds.header .info') as HTMLElement).nextElementSibling?.innerHTML

    return result
  })

  return data
} 

export async function getCorpMarketInfo (page: Page) {
  const data = await page.evaluate(() => {
    const result = Array.from(document.querySelectorAll('.company-data.market-info .rt-tbody .rt-tr')).map(i => (i as HTMLElement).innerText.split('\n'))

    return result
  })

  return fromEntries(data)
}