import playwright, { Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'
import csv from 'csvtojson'
import cliProgress, { SingleBar } from 'cli-progress'

import { csvWriteHeader } from '../utils';
import { IApplicant } from '../interfaces'

async function getList(page: Page, barl: SingleBar, params: {
  corpName: string, 
  filePath: string
}) {
  // 검색
  await page.waitForSelector('.search-bar')
  await page.$eval('#main-app-bar-search', (el: HTMLInputElement, cpName: string) => el.value = cpName, params.corpName)
  await page.click('.icon-search')
  
  // 검색결과 슬라이싱
  // await page.waitForNavigation({
  //   waitUntil: 'networkidle'
  // })
  await page.waitForTimeout(3000)
  const data = await page.evaluate(() => {
    const header = Array.from(document.querySelectorAll('#info-list .company-details .info')).map(i => (i.querySelector('.key') as HTMLElement).innerText)
    const values = Array.from(document.querySelectorAll('#info-list .company-details .info')).map((i, idx) => idx === 0 ? Array.from(i.querySelectorAll('.value i')).map(j => (j as HTMLElement).innerText) : (i.querySelector('.value') as HTMLElement).innerText)
    
    const result: any = {}
    header.forEach((i, idx) => result[i] = values[idx])
    
    return result
  })
  console.log({ data })
  return data
}

// export async function getCorpInfo (page: Page, params: { startDate: string, endDate: string, filePath: string }) {
export async function getCorpInfo () {
  const filePath = 'example.patent-20100101-20210131.csv'
  const startDate = '20100101'
  const endDate = '20210131'

  const fields = ['registrationNumber', 'corporateNumber', 'repName', 'estDate']
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

  console.log(corporations)

  const barl = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey)
  const browser = await playwright.chromium.launch({
    headless: false
  })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('https://www.deepsearch.com/login')
  
  // 로그인
  await page.$eval('input[placeholder="계정"]', (el: HTMLInputElement) => el.value = 'yangeok@samb.kr')
  await page.$eval('input[placeholder="비밀번호"]', (el: HTMLInputElement) => el.value = '17061706w!')
  await page.click('input.button.login')

  // 검색화면 이동
  await page.waitForSelector('.start-button')
  await page.click('.start-button')

  await corporations.reduce(async (prevPromise: any, i: any) => {
    await prevPromise
    const result = await getList(page, barl, {
      filePath,
      corpName: i.name
    })
    console.log(result)
    file.write(`${result['사업자 등록번호']};${result['법인 등록번호']};${result['대표이사']};${result['설립일자']}\n`, err => err && console.log(`> saving file err`))
    // fs.appendFile(params.filePath, `${result.join(';')}\n`, err => console.log(err))
    return result
  }, <any>Promise.resolve())
}