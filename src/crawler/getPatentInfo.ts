import { SingleBar } from 'cli-progress'
import { parse } from 'node-html-parser'
import fromEntries from 'fromentries'
import { URLSearchParams } from 'url'
import { Page } from 'playwright'
import * as path from 'path'
import axios from 'axios'
import * as fs from 'fs'
import moment from 'moment'

import { csvWriteHeader, Indexable, delayPromise, getURL } from '../utils'
import { getProgressBar, getPlaywright } from '../middlewares'


const getBibliographic = (html: any) => {
  const newDocument = parse(html)
  
  const tableData = [...(newDocument).querySelectorAll('.detial_plan_info strong')].map(i => 
    i.nextElementSibling !== null 
    ? i.nextElementSibling.innerText.replace(/\n/g, '').replace(/\t/g, '').replace(/  /g, '')
    : i.nextSibling.textContent.replace(/\n/g, '').replace(/\s/g, '')
  )
  
  const bibliographic = {
    registersNumber: tableData[4].split('(')[0], // 등록번호
    registerDate: tableData[4].split('(')[1] !== undefined ? tableData[4].split('(')[1]?.replace(')', '').replace(/\./g, '-') : '', // 등록일자
    // TODO: 
    // publishNumber// 공개번호
    // publishDate// 공개일자
    // // 공고번호
    // // 공고일자
    // intlApplNumber// 국제출원번호
    // intlApplDate// 국제출원일자
    // intlPublishNumber// 국제공개번호
    // intlPublishDate// 국제공개일자
    // priorityInfo// 우선권정보
    // // 심사진행상태
    // // 심판사항
    // // 특허구분
    // // 기술이전희망여부
    // claimReqDate// 심사청구일자
    astrtCont: String(newDocument.querySelector('p[num="0001a"]').innerText.replace(/\n/g, '').replace(/\;/g, '')) // 요약
  }
  return bibliographic
}
const getIpcs = (html: any) => {
  const newDocument = parse(html)
  
  const tableData = [...(newDocument).querySelectorAll('.detial_plan_info strong')].map(i => 
    i.nextElementSibling !== null 
    ? i.nextElementSibling.innerText.replace(/\n/g, '').replace(/\t/g, '').replace(/  /g, '')
    : i.nextSibling.textContent.replace(/\n/g, '').replace(/\s/g, '')
  )
  const ipcs = tableData[0].split(')').map(i => ({
      code: i.split('(')[0],
      date: i.split('(')[1]?.replace(/\./g, '-')
  })).filter(i => i.date !== undefined)
  return ipcs
}
const getCpcs = (html: any) => {
  const newDocument = parse(html)
  
  const tableData = [...(newDocument).querySelectorAll('.detial_plan_info strong')].map(i => 
    i.nextElementSibling !== null 
    ? i.nextElementSibling.innerText.replace(/\n/g, '').replace(/\t/g, '').replace(/  /g, '')
    : i.nextSibling.textContent.replace(/\n/g, '').replace(/\s/g, '')
  )
  const cpcs = tableData[1].split(')').map(i => ({
    code: i.split('(')[0].substr(1),
    date: i.split('(')[1]?.replace(/\./g, '-')
  })).filter(i => i.date !== undefined)
  return cpcs
}
const getPriorities = (html: any) => {

}
const getApplicants = (html: any) => {
  const newDocument = parse(html)

  const applicantFields = ['applicationNumber', 'name', 'nationality', 'address']
  const applicants = [...newDocument.querySelector('.depth2_title').nextElementSibling.querySelectorAll('tbody tr')].map(i => {
    const name = i.querySelector('.name').innerHTML.split('<br>').map(i => i
      .replace(/\n/g, '')
      .replace(/  /g, '')
      .replace(/	/g, '')
      .replace(/[a-zA-Z]/g, '')
      .replace(/\,/g, '')
    ) 
    
    return {
      applicationNumber: '',
      name: name[0].substr(0, name[0].length - 1),
      number: name[2].replace(/[^0-9]/g, ''),
      nationality: i.querySelector('.nationality').innerText,
      address: i.querySelector('.txt_left').innerText.replace('...', '')
    }
  })
  return applicants
}
const getInventors = (html: any) => {
  const newDocument = parse(html)

  const inventors = [...newDocument.querySelector('.depth2_title02').nextElementSibling.querySelectorAll('tbody tr')].map(i => {
    const name = i.querySelector('.name').innerText
      .replace(/\n/g, '')
      .replace(/\t/g, '')
      .replace(/[a-zA-Z]/g, '')
      .replace(/\,/g, '')
      .replace(/  /g, '')
    
    return {
      name: name.split('(')[0],
      number: name.split('(')[1] !== undefined ? name.split('(')[1].replace(')', '') : '',
      nationality: i.querySelector('.nationality').innerText,
      address: i.querySelector('.txt_left').innerText.replace('...', '')
    }
  })
  return inventors
}
const getClaims = (html: any) => {
  const newDocument = parse(html)

  const claims = [...newDocument.querySelectorAll('tbody .txt_left')]
    .map(i => i.innerText
      .replace(/\n/g, '')
      .replace(/\t/g, '')
      .replace(/  /g, '')
      .replace(/\;/g, '')
      .replace(/\,/g, '')
    )
    .filter(i => i !== '삭제')
  return claims
}
const getCitatingPatents = (html: any, header: string[]) => {
  const newDocument = parse(html)
  
  const citatingValues = [...[...newDocument.querySelectorAll('.tstyle_list')][0].querySelectorAll('tbody tr')]
    .map(i => [...i.querySelectorAll('td')]
      .map((j, idx) => 
        idx === 2
        ? j.innerText.replace(/\./g, '-')
        : j.innerText.replace(/\n/g, '').replace(/  /g, '').replace(/\t/g, '')
      ))
  const citating = citatingValues
  .map(i => i.length > 1 ? fromEntries(i.map((j, index) => ([ header[index], j ]))) : undefined)

  return citating
}
const getCitatedPatents = (html: any, header: string[]) => {
  const newDocument = parse(html)
  
  const citatedValues  = [...[...newDocument.querySelectorAll('.tstyle_list')][1].querySelectorAll('tbody tr')]
    .map(i => [...i.querySelectorAll('td')]
      .map((j, idx) => 
        idx === 1
        ? j.innerText.replace(/\./g, '-')
        : j.innerText.replace(/\n/g, '').replace(/  /g, '').replace(/\t/g, '')
      ))
  const citated = citatedValues
    .map(i => i.length > 1 ? fromEntries(i.map((j, index) => ([ header[index], j ]))): undefined)

  return citated
}
const getFamilyPatents = (html: any, header: string[], applicationNumber: string | number) => {
  const newDocument = parse(html)
    
  const familyPatents = [...new Set([...[...newDocument.querySelectorAll('.tstyle_list')]
    .map(i => [...i.querySelectorAll('tbody tr')])]
    .map(i => i
      .map(j => [...j.querySelectorAll('td')]
        .slice(1)
        .map((k, idx) => idx === 0 ? k.innerText.trim() : k.innerText)))
    .reduce((acc, value) => acc.concat(value), []))]
    .filter(i => i.length)
    .map(i => fromEntries(i.map((j, index) => ([ header[index], j]))))

  return familyPatents
}

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
  await page.evaluate(() => {
    const { document } = (<Indexable>window)
    document.querySelector('#opt28 option[value="30"]').selected = true
    document.querySelector('#opt28 option[value="30"]').value = 10
  })
  await page.click('#pageSel img')
  await page.click('#pageSel a')

  await page.waitForSelector('#loadingBarBack', { state: 'hidden' })
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
      await page.waitForSelector('#loadingBarBack', { state: 'hidden' }),
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
    // TMP: 
    const result = {
      ...i,
      registersNumber: details?.bibliographic.registersNumber,
      registerDate: details?.bibliographic.registerDate,
      astrtCont: details?.bibliographic.astrtCont,
      claimsCount: details?.claims.length,
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
        applicationNumber: (bottom.querySelector('.left_width[style="width: 54%;"] .point01') as HTMLElement)?.innerText.replace(')', '').replace(/\./g, '-').split(' (')[0],
        applicationDate: (bottom.querySelector('.left_width[style="width: 54%;"] .point01') as HTMLElement)?.innerText.replace(')', '').replace(/\./g, '-').split(' (')[1],
        registerStatus: top.querySelector('#iconStatus')?.innerHTML
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
  const urlParams = [
    ['method', 'biblioMain_biblio'],
    // ['applno', params.applicationNumber],
    // ['applno', '2020180005507'], // TMP: 패밀리특허
    // ['applno', '2020190004255'], // TMP: 인용특허
    ['applno', '2020190000436'], // TMP: 피인용특허
    ['link', 'N']
  ]
  const url = getURL(baseUrl, urlParams)

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
      delayPromise(await axios.get(`${url}&next=biblioViewSub01&getType=BASE`), 250), // 서지정보
      delayPromise(await axios.get(`${url}&next=biblioViewSub02&getType=Sub02`), 250), // 인명정보
      // delayPromise(await axios.get(`${url}&next=biblioViewSub03&getType=Sub03`), 250), // 행정처리
      delayPromise(await axios.get(`${url}&next=biblioViewSub04&getType=Sub04`), 250), // 청구항
      // delayPromise(await axios.get(`${url}&next=biblioViewSub06&getType=Sub06`), 250), // 지정국
      delayPromise(await axios.get(`${url}&next=biblioViewSub07&getType=Sub07`), 250), // 인용/피인용
      delayPromise(await axios.get(`${url}&next=biblioViewSub08&getType=Sub08`), 250), // 패밀리특허
      // delayPromise(await axios.get(`${url}&next=biblioViewSub11&getType=Sub11`), 250) // 국가 R&D 연구정보
    ])

    // 서지정보
    const bibliographic = getBibliographic(html01)
    const ipcs = getIpcs(html01)
    const cpcs = getCpcs(html01)
    const priorities = getPriorities(html01)
    
    // 인명정보
    const applicants = getApplicants(html02) // 출원인
    const inventors = getInventors(html02) // 발명인

    // 행정처리 
    // const document03 = parse(html03)

    // 청구항
    const claims = getClaims(html04)
  
    // 지정국 
    // const document05 = parse(html05)

    // 인용/피인용
    const citatingPatents = getCitatingPatents(html06, params.citatingFields) // 인용
    const citatedPatents = getCitatedPatents(html06, params.citatedFields) // 피인용

    // 패밀리정보
    const familyPatents = getFamilyPatents(html07, params.familyPatentFields, params.applicationNumber)
    
    // 국가 R&D 연구정보 
    // const document08 = parse(html08)

    const result = {
      bibliographic, // 서지정보
      ipcs, // IPC
      cpcs, // CPC
      priorities, // 우선권정보
      applicants, // 출원인
      inventors, // 발명자
      claims, // 청구항
      citatingPatents, // 인용특허
      citatedPatents, // 피인용특허
      familyPatents // 패밀리특허
    }

    console.log(result)
    return result
  } catch (err) {
    console.log(err)
  }
}

export async function getPatentInfo ({ startDate, endDate }: { startDate: string, endDate: string }) {
  const fields = ['inventionTitle', 'applicationNumber', 'applicationDate', 'registerStatus', 'applicants', 'inventors', 'registerNumber', 'registerDate', 'astrtCont', 'ipcs', 'cpcs', 'claims', 'claimCount', 'citating', 'citated', 'familyPatents']
  const citatingFields = ['nationality', 'publishNumber', 'publishDate', 'inventionTitle', 'ipcCode']
  const citatedFields = ['applicationNumber', 'applicationDate', 'inventionTitle', 'ipcCode']
  const familyPatentFields = ['applcationNumber', 'failyNumber', 'nationalityCode', 'nationality', 'failyType']

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

  const barl = getProgressBar()
  const { page } = await getPlaywright()

  await getList(page, barl, params)
}
