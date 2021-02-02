import playwright, { Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'
import csv from 'csvtojson'
import cliProgress, { SingleBar } from 'cli-progress'

import { csvWriteHeader } from '../utils';
import { IApplicant } from '../interfaces'

async function getList(page: Page, barl: SingleBar, params: {
  startDate: string, 
  endDate: string, 
  filePath: string
}, corpName: string) {
  // 검색
  await page.waitForSelector('.search-bar')
  await page.$eval('#main-app-bar-search', (el: HTMLInputElement, cpName: string) => el.value = cpName, corpName)
  await page.click('.icon-search')
  
  // 검색결과 슬라이싱
  await page.waitForNavigation({
    waitUntil: 'networkidle'
  })
  await page.waitForTimeout(2000)
  const data = await page.evaluate(() => {
    const data: HTMLElement[] = Array.from(document.querySelectorAll('#info-list .company-details .value'))
    const newData = data
      .slice(0, 2)
      .concat(data.slice(4, 6))
      .map((i: any | HTMLElement, index: number) => {
        switch (index) {
          case 0:
            return JSON.stringify(Array.from(i.querySelectorAll('.clickable-text')).map(j => (j as HTMLElement).innerText))
          case 1:
            return /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(i.innerText.replace('년 ', '-').replace('월 ', '-').replace('일', '')) ? i.innerText.replace('년 ', '-').replace('월 ', '-').replace('일', '') : ''
          case 2:
            return i.innerText
          case 3:
            return i.innerText
        }
      })
    console.log({newData})
    return newData
  })
  
  return data
}

// export async function getCorpInfo (page: Page, params: { startDate: string, endDate: string, filePath: string }) {
export async function getCorpInfo () {
  const params = {
    filePath: 'patent-20100101-20210131.csv',
    startDate: '20100101',
    endDate: '20200131',
  }
  
  const fields = ['registrationNumber', 'corporateNumber', 'repName', 'estDate']
  const file = fs.createWriteStream(path.join(__dirname, '../..//outputs', `corp-${params.startDate}-${params.endDate}.csv`), 'utf-8')
  file.write(csvWriteHeader(fields))

  const arr: any[][] = []
  await csv({ delimiter: ';' })
    .fromFile(path.join(__dirname, '../../outputs', params.filePath))
    .then(json => arr.push(json))

  const corporations = arr[0]
    .map(i => JSON.parse(i.applicants))
    .reduce((acc, value) => acc.concat(value), [])
    .filter((i: any) => i.number.charAt(0) === '1')

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
    const result = await getList(page, barl, params, i.name)
    console.log(result)
    file.write(`${result.join(';')}\n`, err => err && console.log(`> saving file err`))
    // fs.appendFile(params.filePath, `${result.join(';')}\n`, err => console.log(err))
    return result
  }, <any>Promise.resolve())
}