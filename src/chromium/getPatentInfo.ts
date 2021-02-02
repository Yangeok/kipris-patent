import cliProgress, { SingleBar } from 'cli-progress'
import playwright, { Page } from 'playwright'
import { parse } from 'node-html-parser'
import fromEntries from 'fromentries'
import { URLSearchParams } from 'url'
import * as path from 'path'
import axios from 'axios'
import * as fs from 'fs'

import { getCorpInfo } from './getCorpInfo'
import { csvWriteHeader, Indexable, promiseAllSleep } from '../utils'

async function getList(page: Page, barl: SingleBar, params: {
  startDate: string, 
  endDate: string, 
  filePath: string, 
  citatingFields: string[], 
  citatedFields: string[], 
  familyPatentFields: string[]
}) {
  await page.goto('http://kpat.kipris.or.kr/kpat/searchLogina.do?next=MainSearch')
  
  // 검색
  Promise.all([
    await page.type('#queryText', `AD=[${params.startDate}~${params.endDate}]`),
    await page.click('.input_btn')
  ])
  
  // 필터 선택후 클릭
  Promise.all([
    await page.evaluate(() => {
      const { document } = (<Indexable>window)
      document.querySelector('#opt28 option[value="30"]').selected = true
      document.querySelector('#opt28 option[value="30"]').value = 10
    }),
    await page.click('#pageSel img'),
    await page.click('#pageSel a')
  ])

  await page.waitForSelector('#loadingBarBack', {
    state: 'hidden'
  })
  const contentsCount = await page.evaluate(() => {
    return {
      totalCount: Number((document.querySelector('.total') as HTMLElement).innerText.replace(/\,/g, '')),
      currentPage: Number((document.querySelector('.current') as HTMLElement).innerText),
      totalPage: Number(((document.querySelector('.articles') as HTMLElement).childNodes[5].nodeValue as string).replace(/[^0-9]/g, ''))
    }
  })

  let currentPage = contentsCount.currentPage
  while (currentPage < contentsCount.totalPage) {
    barl.start(contentsCount.totalPage, currentPage)
    await page.waitForSelector('.board_pager03')
    Promise.all([
      await getListData(page, params),
      await page.$eval('.board_pager03 strong', el => (el.nextElementSibling as HTMLElement).click()),
      await page.waitForSelector('#loadingBarBack', {
        state: 'hidden'
      }),
    ])
    currentPage += 1
  }
}

async function getListData(page: Page, params: { 
  startDate: string, 
  endDate: string, 
  filePath: string, 
  citatingFields: string[], 
  citatedFields: string[],
  familyPatentFields: string[]
}) {
  await page.waitForSelector('.search_section')
  
  // 요약 리스트 수집
  const summaries = await getDataSummaries(page)
  await summaries.reduce(async (prevPromise, i) => {
    await prevPromise
    const details = await getDataDetails({
      applicationNumber: i.applicationNumber,
      citatingFields: params.citatingFields,
      citatedFields: params.citatedFields,
      familyPatentFields: params.familyPatentFields
    })
    const result = {
      ...i,
      applicants: JSON.stringify(details?.applicants),
      inventors: JSON.stringify(details?.inventors),
      registersNumber: details?.bibliographic.registersNumber,
      registerDate: details?.bibliographic.registerDate,
      astrtCont: details?.bibliographic.astrtCont,
      cpcs: JSON.stringify(details?.bibliographic.cpcs),
      ipcs: JSON.stringify(details?.bibliographic.ipcs),
      claims: JSON.stringify(details?.claims),
      claimsCount: details?.claims.length,
      citating: JSON.stringify(details?.citating) !== '[null]' ? JSON.stringify(details?.citating) : '',
      citated: JSON.stringify(details?.citated) !== '[null]' ? JSON.stringify(details?.citated) : '',
      familyPatents: JSON.stringify(details?.familyPatents) !== '[null]' ? JSON.stringify(details?.familyPatents) : ''
    }

    fs.appendFile(params.filePath, `${Object.values(result).join(';')}\n`, err => err && console.log(`> saving file err`))
    return result
  }, <any>Promise.resolve())
}

async function getDataSummaries(page: Page) {
  const data = page.evaluate(() => {    
    const cards: HTMLElement[] = Array.from(document.querySelectorAll('article[id^="divView"]'))
    
    return cards.map(i => {
      const top = i.querySelector('.search_section_title') as Element
      const bottom = i.querySelector('#mainsearch_info_list') as Element

      return {
        inventionTitle: top.querySelector('.stitle a[title="새창으로 열림"]')?.innerHTML.replace(/\;/g, ''),
        // applicant: (bottom.querySelector('.right_width.letter1 a') as HTMLElement).innerText,
        applicationNumber: (bottom.querySelector('.left_width[style="width: 54%;"] .point01') as HTMLElement)?.innerText.replace(')', '').replace(/\./g, '-').split(' (')[0],
        applicationDate: (bottom.querySelector('.left_width[style="width: 54%;"] .point01') as HTMLElement)?.innerText.replace(')', '').replace(/\./g, '-').split(' (')[1],
        // astrtCont: (bottom.querySelector('.search_txt') as HTMLElement).innerText,
        registerStatus: top.querySelector('#iconStatus')?.innerHTML,
        // ipcCode: (Array.from(bottom.querySelectorAll('.left_width[style="width: 99%;"] .point01')) as HTMLElement[]).map(j => j.innerText.replace(/  /g, ''))
      }
    })
  })
  return data
}

async function getDataDetails(params: { 
  applicationNumber: string, 
  citatingFields: string[],
  citatedFields: string[],
  familyPatentFields: string[]
}) {
  const baseUrl = 'http://kpat.kipris.or.kr/kpat/biblioa.do?'
  const qs = new URLSearchParams()
  qs.set('method', 'biblioMain_biblio')
  qs.set('applno', params.applicationNumber)
  qs.set('link', 'N')

  try {
    const [
      { data: html01 }, {},
      { data: html02 }, {},
      // { data: html03 }, {},
      { data: html04 }, {},
      // { data: html05 }, {},
      { data: html06 }, {},
      { data: html07 }, {},
      // { data: html08 }, {}
    ] = await Promise.all([
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub01&getType=BASE`), promiseAllSleep(250),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub02&getType=Sub02`), promiseAllSleep(250),
      // await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub03&getType=Sub03`), promiseAllSleep(250),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub04&getType=Sub04`), promiseAllSleep(250),
      // await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub06&getType=Sub06`), promiseAllSleep(250),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub07&getType=Sub07`), promiseAllSleep(250),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub08&getType=Sub08`), promiseAllSleep(250),
      // await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub11&getType=Sub11`), promiseAllSleep(250)
    ])

    // 서지정보
    const document01 = parse(html01)
    const tableData = [...document01.querySelectorAll('.detial_plan_info strong')].map(i => 
      i.nextElementSibling !== null 
      ? i.nextElementSibling.innerText.replace(/\n/g, '').replace(/\t/g, '').replace(/  /g, '')
      : i.nextSibling.textContent.replace(/\n/g, '').replace(/\s/g, '')
    )
    const bibliographic = {
      ipcs: tableData[0].split(')').map(i => ({
        ipcCode: i.split('(')[0],
        ipcDate: i.split('(')[1]?.replace(/\./g, '-')
      })).filter(i => i.ipcDate !== undefined),
      cpcs: tableData[1].split(')').map(i => ({
        cpcCode: i.split('(')[0].substr(1),
        cpcDate: i.split('(')[1]?.replace(/\./g, '-')
      })).filter(i => i.cpcDate !== undefined),
      registersNumber: tableData[4].split('(')[0],
      registerDate: tableData[4].split('(')[1] !== undefined ? tableData[4].split('(')[1]?.replace(')', '').replace(/\./g, '-') : '',
      astrtCont: String(document01.querySelector('p[num="0001a"]').innerText.replace(/\n/g, '').replace(/\;/g, ''))
    }
    
    // 인명정보
    const document02 = parse(html02)
    const applicants = [...document02.querySelector('.depth2_title').nextElementSibling.querySelectorAll('tbody tr')].map(i => {
      // TODO: to remove!
      // const name = i.querySelector('.name').innerText.replace(/\n/g, '').replace(/\t/g, '')
      const name = i.querySelector('.name').innerHTML.split('<br>').map(i => i.replace(/\n/g, '').replace(/  /g, '').replace(/	/g, ''))
    
      return {
        name: name[0].substr(0, name[0].length - 1),
        number: name[2].replace(/[^0-9]/g, ''),
        // TODO: to remove!
        // name: name.split('(')[0],
        // number: name.split('(')[1] !== undefined ? name.split('(')[1].replace(')', '') : '',
        nationality: i.querySelector('.nationality').innerText,
        address: i.querySelector('.txt_left').innerText.replace('...', '')
      }
    })

    const inventors = [...document02.querySelector('.depth2_title02').nextElementSibling.querySelectorAll('tbody tr')].map(i => {
      const name = i.querySelector('.name').innerText.replace(/\n/g, '').replace(/\t/g, '')
      return {
        name: name.split('(')[0],
        number: name.split('(')[1] !== undefined ? name.split('(')[1].replace(')', '') : '',
        nationality: i.querySelector('.nationality').innerText,
        address: i.querySelector('.txt_left').innerText.replace('...', '')
      }
    })

    // 행정처리 
    // const document03 = parse(html03)

    // 청구항
    const document04 = parse(html04)
    const claims = [...document04.querySelectorAll('tbody .txt_left')].map(i => i.innerText.replace(/\n/g, '').replace(/\t/g, '').replace(/  /g, '')).filter(i => i !== '삭제')

    // 지정국 
    // const document05 = parse(html05)

    // 인용/피인용
    const document06 = parse(html06)
    const citatingValues = [...[...document06.querySelectorAll('.tstyle_list')][0].querySelectorAll('tbody tr')].map(i => [...i.querySelectorAll('td')].map(j => j.innerText.replace(/\n/g, '').replace(/  /g, '').replace(/\t/g, ''))) 
    const citating = citatingValues.map(i => i.length > 1 ? fromEntries(i.map((j, index) => ([ params.citatingFields[index], j ]))) : null)
    const citatedValues  = [...[...document06.querySelectorAll('.tstyle_list')][1].querySelectorAll('tbody tr')].map(i => [...i.querySelectorAll('td')].map(j => j.innerText.replace(/\n/g, '').replace(/  /g, '').replace(/\t/g, ''))) 
    const citated = citatedValues.map(i => i.length > 1 ?fromEntries(i.map((j, index) => ([ params.citatedFields[index], j ]))): null)

    // 패밀리정보
    const document07 = parse(html07)
    const familyPatentValues = [...document07.querySelectorAll('.tstyle_list')[1].querySelectorAll('tbody tr')].map(i => [...i.querySelectorAll('td')].slice(1).map(j => j.innerText.replace(/\n/g, '').replace(/\t/g, '')))
    const familyPatents = familyPatentValues.map(i => i.length > 1 ? fromEntries(i.map((j, index) => ([ params.familyPatentFields[index], j]))) : null)

    // 국가 R&D 연구정보 
    // const document08 = parse(html08)

    const result = {
      bibliographic, // 서지정보
      applicants, // 인명정보-출원인
      inventors, // 인명정보-발명자
      claims, // 청구항
      citating, // 인용특허
      citated, // 피인용특허
      familyPatents // 패밀리특허
    }
    return result
  } catch (err) {
    console.log(err)
  }
}

export async function getPatentInfo () {
  const startDate = '20100101'
  const endDate = '20210131'
  const fields = ['inventionTitle', 'applicationNumber', 'applicationDate', 'registerStatus', 'applicants', 'inventors', 'registerNumber', 'registerDate', 'astrtCont', 'ipcs', 'cpcs', 'claims', 'claimCount', 'citating', 'citated', 'familyPatents']
  const citatingFields = ['nationality', 'publishNumber', 'publishDate', 'inventionTitle', 'ipcCode']
  const citatedFields = ['applicationNumber', 'applicationDate', 'inventionTitle', 'ipcCode']
  const familyPatentFields = ['failyNumber', 'nationalityCode', 'nationality', 'failyType']

  const filePath = path.join(__dirname, '../../outputs', `patent-${startDate}-${endDate}.csv`)
  const file = fs.createWriteStream(filePath, 'utf-8')
  file.write(csvWriteHeader(fields))

  const params = {
    startDate, 
    endDate, 
    filePath, 
    citatingFields, 
    citatedFields, 
    familyPatentFields
  }

  const barl = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey)
  const browser = await playwright.chromium.launch({
    headless: false
  })
  const context = await browser.newContext()
  const page = await context.newPage()

  await getList(page, barl, params)
  
  // const isExistFile = false
  // if (isExistFile) {
  //   await getCorpInfo(page, filePath)
  // }
}