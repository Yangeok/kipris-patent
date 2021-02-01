import cliProgress, { SingleBar } from 'cli-progress'
import playwright, { Page } from 'playwright'
import { parse } from 'node-html-parser'
import fromEntries from 'fromentries'
import { URLSearchParams } from 'url'
import * as path from 'path'
import axios from 'axios'
import * as fs from 'fs'

import { Indexable, sleep } from '../utils'

async function getList(page: Page, barl: SingleBar, params: {
  startDate: string, endDate: string, filePath: string
}) {
  await page.goto('http://kpat.kipris.or.kr/kpat/searchLogina.do?next=MainSearch')
  
  const clickSearchButton = Promise.all([
    await page.type('#queryText', `AD=[${params.startDate}~${params.endDate}]`),
    await page.click('.input_btn')
  ])
  const clickFilter = Promise.all([
    await page.evaluate(() => {
      const { document } = (<Indexable>window)
      document.querySelector('#opt28 option[value="60"]').selected = true
    }),
    await page.click('#pageSel img')
  ])

  const waitForList = await page.waitForSelector('#loadingBarBack', {
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
    await page.waitForSelector('.board_pager03')
    Promise.all([
      await getListData(page, params),
      await page.$eval('.board_pager03 strong', el => (el.nextElementSibling as HTMLElement).click()),
      await page.waitForSelector('#loadingBarBack', {
        state: 'hidden'
      }),
    ])
    currentPage += 1
    barl.start(contentsCount.totalPage, currentPage)
  }
}

async function getListData(page: Page, params: { startDate: string, endDate: string, filePath: string }) {
  await page.waitForSelector('.search_section')
  
  const summaries = await getDataSummaries(page)
  await summaries.reduce(async (prevPromise, i) => {
    await prevPromise
    const details = await getDataDetails(i.applicationNumber)
    const result = {
      ...i,
      applicants: JSON.stringify(details?.applicants),
      inventors: JSON.stringify(details?.inventors),
      registersNumber: details?.bibliographicData.registersNumber,
      registerDate: details?.bibliographicData.registerDate,
      astrtCont: details?.bibliographicData.astrtCont,
      cpcs: details?.bibliographicData.cpcs,
      ipcs: details?.bibliographicData.ipcs,
      claims: JSON.stringify(details?.claims),
      claimsCount: details?.claims.length,
      citating: JSON.stringify(details?.citating) !== '[null]' ? JSON.stringify(details?.citating) : '',
      citated: JSON.stringify(details?.citated) !== '[null]' ? JSON.stringify(details?.citated) : '',
      familyPatents: JSON.stringify(details?.familyPatents) !== '[null]' ? JSON.stringify(details?.familyPatents) : ''
    }
    console.log(result)
    fs.appendFile(params.filePath, Object.values(result).join(', ') + '\n', err => err && console.log(`> saving file err`))
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
        inventionTitle: top.querySelector('.stitle a[title="새창으로 열림"]')?.innerHTML,
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

async function getDataDetails(applicationNumber: string) {
  console.log(`> applicationNumber: ${applicationNumber}`)
  
  const baseUrl = 'http://kpat.kipris.or.kr/kpat/biblioa.do?'
  const qs = new URLSearchParams()
  qs.set('method', 'biblioMain_biblio')
  qs.set('applno', applicationNumber)
  qs.set('link', 'N')

  try {
    const [
      { data: html01 },
      { data: html02 },
      // { data: html03 },
      { data: html04 },
      // { data: html05 },
      { data: html06 },
      { data: html07 },
      // { data: html08 }
    ] = await Promise.all([
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub01&getType=BASE`),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub02&getType=Sub02`),
      // await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub03&getType=Sub03`),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub04&getType=Sub04`),
      // await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub06&getType=Sub06`),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub07&getType=Sub07`),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub08&getType=Sub08`),
      // await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub11&getType=Sub11`)
    ])

    // 서지정보
    const document01 = parse(html01)
    const tableData = [...document01.querySelectorAll('.detial_plan_info strong')].map(i => 
      i.nextElementSibling !== null 
      ? i.nextElementSibling.innerText.replace(/\n/g, '').replace(/\t/g, '').replace(/  /g, '')
      : i.nextSibling.textContent.replace(/\n/g, '').replace(/\s/g, '')
    )
    const bibliographicData = {
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
      astrtCont: document01.querySelector('p[num="0001a"]').innerText.replace(/\n/g, '').replace(/\;/g, '')
    }

    // 인명정보
    const document02 = parse(html02)
    const applicants = [...document02.querySelector('.depth2_title').nextElementSibling.querySelectorAll('tbody tr')].map(i => {
      const name = i.querySelector('.name').innerText.replace(/\n/g, '').replace(/\t/g, '')
      return {
        name: name.split('(')[0],
        number: name.split('(')[1] !== undefined ? name.split('(')[1].replace(')', '') : '',
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
    const citatingFields = ['nationality', 'publishNumber', 'publishDate', 'inventionTitle', 'ipcCode']
    const citatingValues = [...[...document06.querySelectorAll('.tstyle_list')][0].querySelectorAll('tbody tr')].map(i => [...i.querySelectorAll('td')].map(j => j.innerText.replace(/\n/g, '').replace(/  /g, '').replace(/\t/g, ''))) 
    const citating = citatingValues.map(i => i.length > 1 ? fromEntries(i.map((j, index) => ([ citatingFields[index], j ]))) : null)

    const citatedFields = ['applicationNumber', 'applicationDate', 'inventionTitle', 'ipcCode']
    const citatedValues  = [...[...document06.querySelectorAll('.tstyle_list')][1].querySelectorAll('tbody tr')].map(i => [...i.querySelectorAll('td')].map(j => j.innerText.replace(/\n/g, '').replace(/  /g, '').replace(/\t/g, ''))) 
    const citated = citatedValues.map(i => i.length > 1 ?fromEntries(i.map((j, index) => ([ citatedFields[index], j ]))): null)

    // 패밀리정보
    const document07 = parse(html07)
    const familyPatentKeys = ['failyNumber', 'nationalityCode', 'nationality', 'failyType']
    const familyPatentValues = [...document07.querySelectorAll('.tstyle_list')[1].querySelectorAll('tbody tr')].map(i => [...i.querySelectorAll('td')].slice(1).map(j => j.innerText.replace(/\n/g, '').replace(/\t/g, '')))
    const familyPatents = familyPatentValues.map(i => i.length > 1 ? fromEntries(i.map((j, index) => ([ familyPatentKeys[index], j]))) : null)

    // 국가 R&D 연구정보 
    // const document08 = parse(html08)

    // console.log(bibliographicData)
    // console.log(claims)
    // console.log(citating, citated)
    // console.log(familyPatents)
    const result = {
      bibliographicData,
      applicants,
      inventors,
      claims,
      citating, citated,
      familyPatents
    }
    sleep(500)
    return result
  } catch (err) {
    console.log(err)
  }
}

(async function() {
  const startDate = '20100101'
  const endDate = '20210131'
  const fields = ['']

  const filePath = path.join(__dirname, '../../outputs', `${startDate}-${endDate}.csv`)
  const file = fs.createWriteStream(filePath, 'utf-8')
  file.write(`${fields.join(',')}\n`)

  const params = {
    startDate, endDate, filePath
  }

  const barl = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey)
  
  const browser = await playwright.chromium.launch({
    headless: false
  })
  const context = await browser.newContext()
  const page = await context.newPage()

  await getList(page, barl, params)
})()