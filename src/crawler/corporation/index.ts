import { SingleBar } from 'cli-progress'
import { Page } from 'playwright'
import path from 'path'
import csv from 'csvtojson'
import fs from 'fs'
import dotenv from 'dotenv'

import { getCorpName, getCorpDetailInfo, getCorpFinancialInfo, getIsPublic, getCorpMarketInfo, getCorpsFromPatents } from './getDetail'
import { saveCorpDetail } from './saveDetail'

import { csvWriteHeader, currenyFormatter } from '../../utils'
import { getPlaywright, getProgressBar } from '../../middlewares'
import { corpOutlineFields } from '../../constants'

dotenv.config()

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

async function getList(page: Page, params: {
  corpName: string, 
  filePath: string
}) {
  // 검색
  await page.waitForSelector('.search-bar')
  await page.$eval('#main-app-bar-search', (el: HTMLInputElement, cpName: string) => el.value = cpName, params.corpName.replace('주식회사', '').replace('(주)', ''))
  const searchButton = await page.$('.icon-search')
  if (searchButton) {
    await searchButton?.click()
  }
  // await page.click('.icon-search')
  
  // 검색결과 슬라이싱
  await page.waitForTimeout(2000)
  const notFound = await page.$('.not-found-message')
  if (notFound) {
    return
  }

  // 첫번째 검색결과 클릭
  // await page.click('.company-content .name span')
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
  await page.waitForTimeout(2000)

  const name = await getCorpName(page)
  const isPublic = await getIsPublic(page)
  const details = await getCorpDetailInfo(page)
  const financials = await getCorpFinancialInfo(page)
  // const markets = await getCorpMarketInfo(page)

  return { name, isPublic, details, financials }
}

export async function getCorpInfo ({ startDate, endDate }: { startDate: string, endDate: string }) {
  // 출원인 가져오기 위한 파일 정제 작업
  const filePath = `patent-${startDate}-${endDate}.csv`

  const fields = corpOutlineFields
  const file = fs.createWriteStream(path.join(__dirname, '../../../outputs', `corp-${startDate}-${endDate}.csv`), 'utf-8')
  file.write(csvWriteHeader(fields))

  const arr: any[][] = []
  await csv({ delimiter: ';' })
    .fromFile(path.join(__dirname, '../../../outputs', filePath))
    .then(json => arr.push(json))

  const corporations = getCorpsFromPatents(arr)

  const barl = getProgressBar()
  const { page } = await getPlaywright()
  await getUserSession(page)

  await corporations.reduce(async (prevPromise: any, i: any, idx: number) => {
    const params = {
      filePath,
      corpName: i.name
    }
    
    await prevPromise
    barl.start(corporations.length, idx)
    if (Number(i.number.charAt(0)) !== 5) {
      const result = await getList(page, params)

      if (result) {
        file.write(saveCorpDetail(i, result), err => err && console.log(`> saving file err`))
      }
      return result
    }

    return
  }, Promise.resolve())
}
