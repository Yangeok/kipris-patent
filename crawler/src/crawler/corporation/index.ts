import { Page } from 'playwright'
import path from 'path'
import csv from 'csvtojson'
import fs from 'fs'
import dotenv from 'dotenv'

import { getCorpName, getCorpDetailInfo, getIsPublic, getCorpsFromPatents, getIncomeStatement, getFinancialStatement } from './getDetail'

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
  await page.click('.icon-search')
  
  // 검색결과 슬라이싱
  await page.waitForSelector('.not-found-message')
  const notFound = await page.$('.not-found-message')
  if (notFound) {
    return
  }
  
  // 첫번째 검색결과 클릭
  // await page.waitForSelector('.company-content .name span')
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

  // await page.waitForTimeout(1000)
  await Promise.all([await page.waitForSelector('.nav-tab-menu.company-tabs')])
  
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

    const detail = await getList(page, { corpName: i.applicantName })

    if (detail) {
      const result = {
        applicantNumber: i.applicantNumber,
        corpNumber: detail.details['법인 등록번호']?.replace(/\-/g, '') || '',
        businessNumber: detail.details['사업자 등록번호']?.replace(/\-/g, '') || '',
        repName: detail.details.repName['대표이사'],
        estDate: detail.details['설립일자'] || '',
        corpName: detail.name,
        corpScale: detail.details['기업형태']?.split(' | ')[1],
        corpForm: detail.details['기업형태']?.split(' | ')[0] || '',
        indCat: detail.details['산업분류'],
        isExtAudit: detail.details['기업형태']?.split(' | ')[2] || '',
        isClose: detail.details['기업형태']?.split(' | ')[3] || '',
        isPublic: detail.isPublic,
        revenue: detail.incomeStatement.revenue,
        salesCost: detail.incomeStatement.salesCost,
        sellingAndAdmnstExp: detail.incomeStatement.sellingAndAdmnstExp,
        nonOprtIncome: detail.incomeStatement.nonOprtIncome,
        profit: detail.incomeStatement.profit,
        grossProfitLoss: detail.incomeStatement.grossProfitLoss,
        operatingProfitLoss: detail.incomeStatement.operatingProfitLoss,
        profitBeforeIncomeTaxLoss: detail.incomeStatement.profitBeforeIncomeTaxLoss,
        incomeTaxExp: detail.incomeStatement.incomeTaxExp,
        continuingOperatingProfitLoss: detail.incomeStatement.continuingOperatingProfitLoss,
        discontinuedOperatingProfitLoss: detail.incomeStatement.discontinuedOperatingProfitLoss,
        totalNetIncome: detail.incomeStatement.totalNetIncome,
        otherComprehensiveIncome: detail.incomeStatement.otherComprehensiveIncome,
        comprehensiveIncome: detail.incomeStatement.comprehensiveIncome,
        currentAssets: detail.financialStatement.currentAssets,
        nonCurrentAssets: detail.financialStatement.nonCurrentAssets,
        currentLiabilities: detail.financialStatement.currentLiabilities,
        nonCurrentLiabilities: detail.financialStatement.nonCurrentLiabilities,
        totalAssets: detail.financialStatement.totalAssets,
        totalLiabilities: detail.financialStatement.totalLiabilities,
        totalEquity: detail.financialStatement.totalEquity,
        totalLiabilitiesAndEquity: detail.financialStatement.totalLiabilitiesAndEquity,

        // revenue_2019 : detail.incomeStatement.revenue_2019 || '',
        // revenue_2018 : detail.incomeStatement.revenue_2018 || '',
        // revenue_2017 : detail.incomeStatement.revenue_2017 || '',
        // revenue_2016 : detail.incomeStatement.revenue_2016 || '',
        // revenue_2015 : detail.incomeStatement.revenue_2015 || '',
        // salesCost_2019 : detail.incomeStatement.salesCost_2019 || '',
        // salesCost_2018 : detail.incomeStatement.salesCost_2018 || '',
        // salesCost_2017 : detail.incomeStatement.salesCost_2017 || '',
        // salesCost_2016 : detail.incomeStatement.salesCost_2016 || '',
        // salesCost_2015 : detail.incomeStatement.salesCost_2015 || '',
        // sellingAndadmnstExp_2019 : detail.incomeStatement.sellingAndadmnstExp_2019 || '',
        // sellingAndadmnstExp_2018 : detail.incomeStatement.sellingAndadmnstExp_2018 || '',
        // sellingAndadmnstExp_2017 : detail.incomeStatement.sellingAndadmnstExp_2017 || '',
        // sellingAndadmnstExp_2016 : detail.incomeStatement.sellingAndadmnstExp_2016 || '',
        // sellingAndadmnstExp_2015 : detail.incomeStatement.sellingAndadmnstExp_2015 || '',
        // nonOprtIncome_2019 : detail.incomeStatement.nonOprtIncome_2019 || '',
        // nonOprtIncome_2018 : detail.incomeStatement.nonOprtIncome_2018 || '',
        // nonOprtIncome_2017 : detail.incomeStatement.nonOprtIncome_2017 || '',
        // nonOprtIncome_2016 : detail.incomeStatement.nonOprtIncome_2016 || '',
        // nonOprtIncome_2015 : detail.incomeStatement.nonOprtIncome_2015 || '',
        // profit_2019 : detail.incomeStatement.profit_2019 || '',
        // profit_2018 : detail.incomeStatement.profit_2018 || '',
        // profit_2017 : detail.incomeStatement.profit_2017 || '',
        // profit_2016 : detail.incomeStatement.profit_2016 || '',
        // profit_2015 : detail.incomeStatement.profit_2015 || '',
        // grossProfitLoss_2019 : detail.incomeStatement.grossProfitLoss_2019 || '',
        // grossProfitLoss_2018 : detail.incomeStatement.grossProfitLoss_2018 || '',
        // grossProfitLoss_2017 : detail.incomeStatement.grossProfitLoss_2017 || '',
        // grossProfitLoss_2016 : detail.incomeStatement.grossProfitLoss_2016 || '',
        // grossProfitLoss_2015 : detail.incomeStatement.grossProfitLoss_2015 || '',
        // operatingProfitLoss_2019 : detail.incomeStatement.operatingProfitLoss_2019 || '',
        // operatingProfitLoss_2018 : detail.incomeStatement.operatingProfitLoss_2018 || '',
        // operatingProfitLoss_2017 : detail.incomeStatement.operatingProfitLoss_2017 || '',
        // operatingProfitLoss_2016 : detail.incomeStatement.operatingProfitLoss_2016 || '',
        // operatingProfitLoss_2015 : detail.incomeStatement.operatingProfitLoss_2015 || '',
        // profitBeforeIncomeTaxLoss_2019 : detail.incomeStatement.profitBeforeIncomeTaxLoss_2019 || '',
        // profitBeforeIncomeTaxLoss_2018 : detail.incomeStatement.profitBeforeIncomeTaxLoss_2018 || '',
        // profitBeforeIncomeTaxLoss_2017 : detail.incomeStatement.profitBeforeIncomeTaxLoss_2017 || '',
        // profitBeforeIncomeTaxLoss_2016 : detail.incomeStatement.profitBeforeIncomeTaxLoss_2016 || '',
        // profitBeforeIncomeTaxLoss_2015 : detail.incomeStatement.profitBeforeIncomeTaxLoss_2015 || '',
        // incomeTaxExp_2019 : detail.incomeStatement.incomeTaxExp_2019 || '',
        // incomeTaxExp_2018 : detail.incomeStatement.incomeTaxExp_2018 || '',
        // incomeTaxExp_2017 : detail.incomeStatement.incomeTaxExp_2017 || '',
        // incomeTaxExp_2016 : detail.incomeStatement.incomeTaxExp_2016 || '',
        // incomeTaxExp_2015 : detail.incomeStatement.incomeTaxExp_2015 || '',
        // continuingOperatingProfitLoss_2019 : detail.incomeStatement.continuingOperatingProfitLoss_2019 || '',
        // continuingOperatingProfitLoss_2018 : detail.incomeStatement.continuingOperatingProfitLoss_2018 || '',
        // continuingOperatingProfitLoss_2017 : detail.incomeStatement.continuingOperatingProfitLoss_2017 || '',
        // continuingOperatingProfitLoss_2016 : detail.incomeStatement.continuingOperatingProfitLoss_2016 || '',
        // continuingOperatingProfitLoss_2015 : detail.incomeStatement.continuingOperatingProfitLoss_2015 || '',
        // discontinuedOperatingProfitLoss_2019 : detail.incomeStatement.discontinuedOperatingProfitLoss_2019 || '',
        // discontinuedOperatingProfitLoss_2018 : detail.incomeStatement.discontinuedOperatingProfitLoss_2018 || '',
        // discontinuedOperatingProfitLoss_2017 : detail.incomeStatement.discontinuedOperatingProfitLoss_2017 || '',
        // discontinuedOperatingProfitLoss_2016 : detail.incomeStatement.discontinuedOperatingProfitLoss_2016 || '',
        // discontinuedOperatingProfitLoss_2015 : detail.incomeStatement.discontinuedOperatingProfitLoss_2015 || '',
        // currentAssets_2019 : detail.financialStatement.currentAssets_2019 || '',
        // currentAssets_2018 : detail.financialStatement.currentAssets_2018 || '',
        // currentAssets_2017 : detail.financialStatement.currentAssets_2017 || '',
        // currentAssets_2016 : detail.financialStatement.currentAssets_2016 || '',
        // currentAssets_2015 : detail.financialStatement.currentAssets_2015 || '',
        // nonCurrentAssets_2019 : detail.financialStatement.nonCurrentAssets_2019 || '',
        // nonCurrentAssets_2018 : detail.financialStatement.nonCurrentAssets_2018 || '',
        // nonCurrentAssets_2017 : detail.financialStatement.nonCurrentAssets_2017 || '',
        // nonCurrentAssets_2016 : detail.financialStatement.nonCurrentAssets_2016 || '',
        // nonCurrentAssets_2015 : detail.financialStatement.nonCurrentAssets_2015 || '',
        // currentLiabilities_2019 : detail.financialStatement.currentLiabilities_2019 || '',
        // currentLiabilities_2018 : detail.financialStatement.currentLiabilities_2018 || '',
        // currentLiabilities_2017 : detail.financialStatement.currentLiabilities_2017 || '',
        // currentLiabilities_2016 : detail.financialStatement.currentLiabilities_2016 || '',
        // currentLiabilities_2015 : detail.financialStatement.currentLiabilities_2015 || '',
        // nonCurrentLiabilities_2019 : detail.financialStatement.nonCurrentLiabilities_2019 || '',
        // nonCurrentLiabilities_2018 : detail.financialStatement.nonCurrentLiabilities_2018 || '',
        // nonCurrentLiabilities_2017 : detail.financialStatement.nonCurrentLiabilities_2017 || '',
        // nonCurrentLiabilities_2016 : detail.financialStatement.nonCurrentLiabilities_2016 || '',
        // nonCurrentLiabilities_2015 : detail.financialStatement.nonCurrentLiabilities_2015 || '',
        // totalAssets_2019 : detail.financialStatement.totalAssets_2019 || '',
        // totalAssets_2018 : detail.financialStatement.totalAssets_2018 || '',
        // totalAssets_2017 : detail.financialStatement.totalAssets_2017 || '',
        // totalAssets_2016 : detail.financialStatement.totalAssets_2016 || '',
        // totalAssets_2015 : detail.financialStatement.totalAssets_2015 || '',
        // totalLiabilities_2019 : detail.financialStatement.totalLiabilities_2019 || '',
        // totalLiabilities_2018 : detail.financialStatement.totalLiabilities_2018 || '',
        // totalLiabilities_2017 : detail.financialStatement.totalLiabilities_2017 || '',
        // totalLiabilities_2016 : detail.financialStatement.totalLiabilities_2016 || '',
        // totalLiabilities_2015 : detail.financialStatement.totalLiabilities_2015 || '',
        // totalEquity_2019 : detail.financialStatement.totalEquity_2019 || '',
        // totalEquity_2018 : detail.financialStatement.totalEquity_2018 || '',
        // totalEquity_2017 : detail.financialStatement.totalEquity_2017 || '',
        // totalEquity_2016 : detail.financialStatement.totalEquity_2016 || '',
        // totalEquity_2015 : detail.financialStatement.totalEquity_2015 || '',
        // totalLiabilitiesAndEquity_2019 : detail.financialStatement.totalLiabilitiesAndEquity_2019 || '',
        // totalLiabilitiesAndEquity_2018 : detail.financialStatement.totalLiabilitiesAndEquity_2018 || '',
        // totalLiabilitiesAndEquity_2017 : detail.financialStatement.totalLiabilitiesAndEquity_2017 || '',
        // totalLiabilitiesAndEquity_2016 : detail.financialStatement.totalLiabilitiesAndEquity_2016 || '',
        // totalLiabilitiesAndEquity_2015 : detail.financialStatement.totalLiabilitiesAndEquity_2015 || '',
      }
      file.write(`${Object.values(result).join(';')}\n`, err => err && console.log(`> saving file err`))
    }
    return
  }, Promise.resolve())
}
