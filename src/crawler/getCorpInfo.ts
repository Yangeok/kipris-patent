import { SingleBar } from 'cli-progress'
import { Page } from 'playwright'
import * as path from 'path'
import csv from 'csvtojson'
import * as fs from 'fs'

import { csvWriteHeader } from '../utils';
import { getPlaywright, getProgressBar } from '../middlewares'
import { ICorpOutline, ICorpMarket, ICorpFinance, ICorpNumber } from '../interfaces'
import { corpOutlineFields, corpMarketFields, corpFinanceFields} from '../constants'

const username = process.env.DS_USERNAME as string
const password = process.env.DS_PASSWORD as string

async function getUserSession (page: Page) {
  // 로그인 페이지 이동
  await page.goto('https://www.deepsearch.com/login')
  
  // 로그인
  await page.$eval('input[placeholder="계정"]', (el: HTMLInputElement, id) => el.value = id, username)
  await page.$eval('input[placeholder="비밀번호"]', (el: HTMLInputElement, pw) => el.value = pw, password)
  await page.click('input.button.login')

  // 검색화면 이동
  await page.waitForSelector('.start-button')
  await page.click('.start-button')
}

async function getCorpDetailInfo (page: Page) {
  const data = await page.evaluate(() => {
    const header = Array.from(document.querySelectorAll('#info-list .company-details .info')).map(i => (i.querySelector('.key') as HTMLElement).innerText)
    const values = Array.from(document.querySelectorAll('#info-list .company-details .info')).map((i, idx) => {
      if (idx === 0) {
        return Array.from(i.querySelectorAll('.value i')).map(j => (j as HTMLElement).innerText)
      } 
      if (idx === 1) {
        return (i.querySelector('.value') as HTMLElement).innerText.replace('년 ', '-').replace('월 ', '-').replace('일', '')
      }
      return idx === 0 ? Array.from(i.querySelectorAll('.value i')).map(j => (j as HTMLElement).innerText) : (i.querySelector('.value') as HTMLElement).innerText
    })
    
    const result: any = {}
    header.forEach((i, idx) => result[i] = values[idx])
    result['지번 주소'] = result['지번 주소'].replace(/\,/g, '')
    
    return result
  })

  console.log({ data })
  return await data
}

async function getCorpFinancialInfo (page: Page) {
    
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
  await page.waitForTimeout(5000)

  const details = getCorpDetailInfo(page)
  const financials = getCorpFinancialInfo(page)

  return { details, financials }
}

export async function getCorpInfo ({ startDate, endDate }: { startDate: string, endDate: string }) {
  // 출원인 가져오기 위한 파일 정제 작업
  const filePath = `examppatent-${startDate}-${endDate}.csv`

  const fields = ['businessNumber', 'corpNumber', 'repName', 'estDate', 'address', 'corpName', 'applicantNumber', 'applicantNationality', ]
  const file = fs.createWriteStream(path.join(__dirname, '../../outputs', `corp-${startDate}-${endDate}.csv`), 'utf-8')
  file.write(csvWriteHeader(fields))

  const arr: any[][] = []
  await csv({ delimiter: ';' })
    .fromFile(path.join(__dirname, '../../outputs', filePath))
    .then(json => arr.push(json))

  const corporations = arr[0]
    .map(i => JSON.parse(i.applicants))
    .reduce((acc, value) => acc.concat(value), [])
    .filter((i: any) => i.number.charAt(0) === '1' || i.number.charAt(0) === '5')
  console.log(corporations, corporations.length)

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
      
      // file.write(`${result.details['사업자 등록번호']};${result.details['법인 등록번호']};${result.details['대표이사']};${result.details['설립일자'] ? result.details['설립일자'] : ''};${result.details['지번 주소']};${i.name};${i.number};${i.nationality}\n`, err => err && console.log(`> saving file err`))
      return result
    }

    file.write(`;;;;${i.address};${i.name};${i.number};${i.nationality}\n`, err => err && console.log(`> saving file err`))
    return
  }, Promise.resolve())
}
