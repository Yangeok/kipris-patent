import { SingleBar } from 'cli-progress'
import { Page } from 'playwright'
import path from 'path'
import csv from 'csvtojson'
import fs from 'fs'

import { getCorpName, getCorpDetailInfo, getCorpFinancialInfo, getIsPublic, getCorpMarketInfo } from './getDetail'

import { csvWriteHeader, fromEntries, currenyFormatter } from '../../utils'
import { getPlaywright, getProgressBar } from '../../middlewares'
import { ICorpOutline, ICorpMarket, ICorpFinance, ICorpNumber } from '../../interfaces'
import { corpFiles, corpOutlineFields, corpMarketFields, corpFinanceFields} from '../../constants'

const username = process.env.DS_USERNAME as string
const password = process.env.DS_PASSWORD as string
console.log({ username, password })

async function getUserSession (page: Page) {
  // 로그인 페이지 이동
  await page.goto('https://www.deepsearch.com/login')
  await page.evaluate(() => window.stop())

  // 로그인
  await page.$eval('input[placeholder="계정"]', (el: HTMLInputElement, id) => el.value = id, username)
  await page.$eval('input[placeholder="비밀번호"]', (el: HTMLInputElement, pw) => el.value = pw, password)
  await page.click('input.button.login')

  // 검색화면 이동
  await page.waitForSelector('.start-button')
  await page.click('.start-button')
}

async function getList(page: Page, barl: SingleBar, params: {
  corpName: string, 
  filePath: string
}) {
  // 검색
  await page.waitForSelector('.search-bar')
  await page.$eval('#main-app-bar-search', (el: HTMLInputElement, cpName: string) => el.value = cpName, params.corpName.replace('주식회사', '').replace('(주)', ''))
  await page.click('.icon-search')
  
  // 검색결과 슬라이싱
  await page.waitForTimeout(2000)

  // 첫번째 검색결과 클릭
  await page.click('.company-content .name span')
  await page.evaluate(() => {
    const firstResult = document.querySelector('.company-content .name span') as HTMLElement
    if (firstResult !== null) {
      firstResult.click()
    }
    return
  })
  await page.waitForTimeout(2000)

  const name = await getCorpName(page)
  const isPublic = await getIsPublic(page)
  const details = await getCorpDetailInfo(page)
  const financials = await getCorpFinancialInfo(page)
  const markets = await getCorpMarketInfo(page)

  return { name, isPublic, details, financials, markets }
}

export async function getCorpInfo ({ startDate, endDate }: { startDate: string, endDate: string }) {
  // 출원인 가져오기 위한 파일 정제 작업
  const filePath = `patent-${startDate}-${endDate}.csv`

  const fields = ['applicantNumber', 'corpNumber', 'businessNumber', 'repName', 'estDate', 'address', 'corpName', 'corpScale', 'corpForm', 'indCat', 'nationality', 'isExtAudit', 'isClose', 'isPublic', 'totalSales', 'bizProfits', 'crtmNetIncome', 'assets', 'liabilities', 'capital', 'employees']
  const file = fs.createWriteStream(path.join(__dirname, '../../../outputs', `corp-${startDate}-${endDate}.csv`), 'utf-8')
  file.write(csvWriteHeader(fields))

  const arr: any[][] = []
  await csv({ delimiter: ';' })
    .fromFile(path.join(__dirname, '../../../outputs', filePath))
    .then(json => arr.push(json))

  const corporations = arr[0]
    .map(i => JSON.parse(i.applicants))
    .reduce((acc, value) => acc.concat(value), [])
    .filter((i: any) => i.number.charAt(0) === '1' || i.number.charAt(0) === '5')

  const barl = getProgressBar()
  const { page } = await getPlaywright()
  await getUserSession(page)

  await corporations.reduce(async (prevPromise: any, i: any) => {
    const params = {
      filePath,
      corpName: i.name
    }

    await prevPromise
    if (Number(i.number.charAt(0)) !== 5) {
      const result = await getList(page, barl, params)
      console.log(result)

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
      // ${result.financials['종업원수(명)'] ? result.financials['종업원수(명)'].replace(/\,/g, '') : ''};
      // \n
      // `

      file.write(`${i.number};${result.details['법인 등록번호'].replace(/\-/g, '')};${result.details['사업자 등록번호'].replace(/\-/g, '')};${result.details['대표이사']};${result.details['설립일자'] ? result.details['설립일자'] : ''};${result.details['지번 주소']};${result.name};${result.details['기업형태'].split(' | ')[1]};${result.details['기업형태'].split(' | ')[0]};${result.details['산업분류']};${i.nationality};${result.details['기업형태'].split(' | ')[2]};${result.details['기업형태'].split(' | ')[3] ? result.details['기업형태'].split(' | ')[3] : ''};${result.isPublic};${result.financials['매출액'] ? currenyFormatter(result.financials['매출액'].replace(/\,/g, '')) : ''};${result.financials['당기순이익'] ? currenyFormatter(result.financials['당기순이익'].replace(/\,/g, '')) : ''};${result.financials['자산'] ? currenyFormatter(result.financials['자산'].replace(/\,/g, '')) : ''};${result.financials['부채'] ? currenyFormatter(result.financials['부채'].replace(/\,/g, '')) : ''};${result.financials['자본'] ? currenyFormatter(result.financials['자본'].replace(/\,/g, '')) : ''};${result.financials['종업원수(명)'] ? result.financials['종업원수(명)'].replace(/\,/g, '') : ''};\n`, err => err && console.log(`> saving file err`))
      return result
    }

    return
  }, Promise.resolve())
}
