import { Page } from 'playwright'
import path from 'path'
import csv from 'csvtojson'
import fs from 'fs'
import dotenv from 'dotenv'

import { getCorpName, getCorpDetailInfo, getIsPublic, getCorpsFromPatents, getIncomeStatement, getFinancialStatement } from './getDetail'
import { saveCorpDetail } from './saveDetail'

import { csvWriteHeader } from '../../utils'
import { getPlaywright, getProgressBar } from '../../middlewares'
import { corpOutlineFields, financialStatementFields, incomeStatementFields, koreanFinancialStatementFields, koreanIncomeStatementFields } from '../../constants'

dotenv.config()

const username = process.env.DS_USERNAME as string
const password = process.env.DS_PASSWORD as string

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

async function getList(page: Page, params: {
  corpName: string
}) {
  // 검색
  await page.waitForSelector('.search-bar')
  await page.$eval('#main-app-bar-search', (el: HTMLInputElement, cpName: string) => el.value = cpName, params.corpName.replace('주식회사', '').replace('(주)', ''))
  const searchButton = await page.$('.icon-search')
  if (searchButton) {
    await searchButton?.click()
  }
  
  // 검색결과 슬라이싱
  await page.waitForTimeout(2000)
  const notFound = await page.$('.not-found-message')
  if (notFound) {
    return
  }
  
  // 첫번째 검색결과 클릭
  await page.waitForSelector('.company-content .name span')
  const notFound2 = await page.evaluate(() => {
    const firstResult = document.querySelector('.company-content .name span') as HTMLElement
    if (firstResult !== null) {
      firstResult.click()
      return false
    }
    return true
  })
  if (notFound2) {
    return
  }

  await page.waitForTimeout(3000)
  await page.waitForSelector('.nav-tab-menu.company-tabs')
  
  const name = await getCorpName(page)
  const isPublic = await getIsPublic(page)
  const details = await getCorpDetailInfo(page)

  // 재무정보 클릭
  try {
    await Promise.all([
      await page.evaluate(() => {
        (Array.from(document.querySelectorAll('#tabs .items a')).filter(i => (i as HTMLElement).innerText.includes('재무 정보'))[0] as HTMLElement).click()
      }),
      await page.waitForSelector('#income-statement .rt-tbody .rt-tr'),
      await page.waitForSelector('#financial-statements .rt-tbody .rt-tr')
    ])
  } catch(e) {
    return { name, isPublic, details, incomeStatement: {}, financialStatement: {} }
  }

  const incomeStatement = await getIncomeStatement(page, koreanIncomeStatementFields, incomeStatementFields)
  const financialStatement = await getFinancialStatement(page, koreanFinancialStatementFields, financialStatementFields)

  // 탭 닫기
  await page.click('.tab-layout-container .active .delete-tab')

  return { name, isPublic, details, incomeStatement, financialStatement }
}

async function getPatentArrFromCsv ({
  outputPath,
  filePath
}: {
  outputPath: string
  filePath: string
}) {
  const arr: any[][] = []
  await csv({ delimiter: ';' })
    .fromFile(path.join(__dirname, outputPath, filePath))
    .then(json => arr.push(json))

  return arr
}

export async function getCorpInfo ({ startDate, endDate, outputPath }: { startDate: string, endDate: string, outputPath: string }) {
  const filePath = `patent-${startDate}-${endDate}.csv`
  const file = fs.createWriteStream(path.join(__dirname, outputPath, `corp-${startDate}-${endDate}.csv`), 'utf-8')
  file.write(csvWriteHeader(corpOutlineFields))
  
  const arr = await getPatentArrFromCsv({ outputPath, filePath })
  const corporations = getCorpsFromPatents(arr)

  const barl = getProgressBar()
  const { page } = await getPlaywright()
  await getUserSession(page)
  
  await corporations.reduce(async (prevPromise: any, i: any, idx: number) => {  
    await prevPromise
    barl.start(corporations.length, idx + 1)
    
    fs.writeFile('../current_applicant.log', `${JSON.stringify(i)}\nindex: ${idx}`, err => err && console.log(err))

    const result = await getList(page, { corpName: i.applicantName })

    if (result) {
      file.write(saveCorpDetail(i.applicantNumber, result), err => err && console.log(`> saving file err`))
    }
    return
  }, Promise.resolve())
}
