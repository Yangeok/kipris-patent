import playwright, { Page } from 'playwright'
import { parse } from 'node-html-parser'
import axios from 'axios'
import cliProgress, { SingleBar } from 'cli-progress'
import * as fs from 'fs'
import * as path from 'path'

import { Indexable } from '../utils'
import { URLSearchParams } from 'url'

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
  const summaryDetails = await summaries.reduce(async (prevPromise, i) => {
    await prevPromise
    const details = await getDataDetails(i.applicationNumber)
    const result = {
      ...i,
      applicants: JSON.stringify(details?.applicants),
      inventors: JSON.stringify(details?.inventors) 
    }
    fs.appendFile(params.filePath, Object.values(result).join(', ') + '\n', err => err && console.log(`> saving file err`))
    return result
  }, <any>Promise.resolve())

  // TODO: 파일 저장
}

async function getDataSummaries(page: Page) {
  const data = page.evaluate(() => {    
    const cards: HTMLElement[] = Array.from(document.querySelectorAll('article[id^="divView"]'))
    
    return cards.map(i => {
      const top = i.querySelector('.search_section_title') as Element
      const bottom = i.querySelector('#mainsearch_info_list') as Element

      return {
        inventionTitle: top.querySelector('.stitle a[title="새창으로 열림"]')?.innerHTML,
        applicant: (bottom.querySelector('.right_width.letter1 a') as HTMLElement).innerText,
        applicationNumber: (bottom.querySelector('.left_width[style="width: 54%;"] .point01') as HTMLElement)?.innerText.replace(')', '').replace(/\./g, '-').split(' (')[0],
        applicationDate: (bottom.querySelector('.left_width[style="width: 54%;"] .point01') as HTMLElement)?.innerText.replace(')', '').replace(/\./g, '-').split(' (')[1],
        astrtCont: (bottom.querySelector('.search_txt') as HTMLElement).innerText,
        registerStatus: top.querySelector('#iconStatus')?.innerHTML,
        ipcCode: (Array.from(bottom.querySelectorAll('.left_width[style="width: 99%;"] .point01')) as HTMLElement[]).map(j => j.innerText).join('|').replace(/  /g, '')
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
      { data: html03 },
      { data: html04 },
      { data: html05 },
      { data: html06 },
      { data: html07 },
      { data: html08 }
    ] = await Promise.all([
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub01&getType=BASE`),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub02&getType=Sub02`),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub03&getType=Sub03`),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub04&getType=Sub04`),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub06&getType=Sub06`),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub07&getType=Sub07`),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub08&getType=Sub08`),
      await axios.get(`${baseUrl}${qs.toString()}&next=biblioViewSub11&getType=Sub11`)
    ])
    // TODO: 서지정보
    // const { data: html01 } = await axios.get(`${baseUrl}biblioViewSub01&applno=${applicationNumber}&getType=BASE&link=N`)
    const document01 = parse(html01)
    // FIXME: 
    // console.log({ 
    //   html01: html01 ? true : false,
    //   html02: html02 ? true : false,
    //   html03: html03 ? true : false,
    //   html04: html04 ? true : false,
    //   html05: html05 ? true : false,
    //   html06: html06 ? true : false,
    //   html07: html07 ? true : false,
    //   html08: html08 ? true : false,
    // })

    /**
     * TODO: IPC, CPC, 출원일자/번호, 출원인, 등록번호/일자, 공개번호/일자
     * 공고번호/일자, 국제출원번호/일자, 국제공개번호/일자, 법적상태, 심사진행상태, 심판사항, 구분, 원출원번호/일자, 관련 출원번호, 기술이전 희망, 심사청구여부/일자
     */

    // FIXME: 인명정보
    // const { data: html02 } = await axios.get(`${baseUrl}biblioViewSub02&applno=${applicationNumber}&getType=Sub02&link=N`)
    const document = parse(html02)

    const applicants = [...document.querySelector('.depth2_title').nextElementSibling.querySelectorAll('tbody tr')].map(i => {
      const name = i.querySelector('.name').innerText.replace(/\n/g, '').replace(/\t/g, '')
      return {
        name: name.split('(')[0],
        number: name.split('(')[1] !== undefined ? name.split('(')[1].replace(')', '') : '',
        nationality: i.querySelector('.nationality').innerText,
        address: i.querySelector('.txt_left').innerText.replace('...', '')
      }
    })
    const inventors = [...document.querySelector('.depth2_title02').nextElementSibling.querySelectorAll('tbody tr')].map(i => {
      const name = i.querySelector('.name').innerText.replace(/\n/g, '').replace(/\t/g, '')
      return {
        name: name.split('(')[0],
        number: name.split('(')[1] !== undefined ? name.split('(')[1].replace(')', '') : '',
        nationality: i.querySelector('.nationality').innerText,
        address: i.querySelector('.txt_left').innerText.replace('...', '')
      }
    })
    /**
     * TODO: 대리인, 최종권리자
     */

    // TODO: 행정처리 
    // const { data: html03 } = await axios.get(`${baseUrl}biblioViewSub03&applno=${applicationNumber}&getType=Sub03&link=N`)
    const document03 = parse(html03)

    // 청구항
    // const { data: html04 } = await axios.get(`${baseUrl}biblioViewSub04&applno=${applicationNumber}&getType=Sub04&link=N`)
    const document04 = parse(html04)
    /**
     * TODO: 청구항 상세
     */

    // 지정국 
    // const { data: html05 } = await axios.get(`${baseUrl}biblioViewSub06&applno=${applicationNumber}&getType=Sub06&link=N`)
    const document05 = parse(html05)

    // 인용/피인용
    // const { data: html06 } = await axios.get(`${baseUrl}biblioViewSub07&applno=${applicationNumber}&getType=Sub07&link=N`)
    const document06 = parse(html06)
    /**
     * TODO: 
     * 인용 => 국가, 공보번호, 공보일자, 발명의 명칭, IPC
     * 피인용 => 출원번호, 출원일자, 발명의 명칭, IPC
     */

    // 패밀리정보
    // const { data: html07 } = await axios.get(`${baseUrl}biblioViewSub08&applno=${applicationNumber}&getType=Sub08&link=N`)
    const document07 = parse(html07)
    /**
     * TODO: 
     * 국가별특허 문헌정보 => 패밀리번호, 국가코드, 국가명, 종류
     * DOCDB 패밀리정보 => 패밀리번호, 국가코드, 국가명, ㅈ오류
     */

    // TODO: 국가 R&D 연구정보 
    // const { data: html08 } = await axios.get(`${baseUrl}biblioViewSub11&applno=${applicationNumber}&getType=Sub11&link=N`)
    const document08 = parse(html08)
    /**
     * TODO: 
     * 연구부처, 주관기관, 연구사업, 연구과제
     */

    // TODO: csv 포맷에 맞추기
    const result = {
      applicants,
      inventors
    }
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