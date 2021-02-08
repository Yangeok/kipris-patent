import { SingleBar } from 'cli-progress'
import { Page } from 'playwright'
import axios from 'axios'
import path from 'path'
import fs from 'fs'

import { getBibliographic, getApplicants, getCpcs, getCitatedPatents, getCitatingPatents, getClaims, getFamilyPatents, getInventors, getIpcs } from './getDetail'

import { csvWriteHeader, Indexable, delayPromise, getURL } from '../../utils'
import { getProgressBar, getPlaywright } from '../../middlewares'
import { IBibliographic, IApplicant, IInventor, IIpc, ICpc, IClaim, ICitating, ICitated, IFamilyPatent, IApplicantNumber, IApplicationNumber, IFile } from '../../interfaces'
import { patentFiles, citatingFields, citatedFields, familyPatentFields, applicantFields } from '../../constants'

async function getList(page: Page, barl: SingleBar, params: {
  startDate: string, 
  endDate: string, 
  files: IFile[],
  fields: {
    citatingFields: Array<keyof ICitating>,
    citatedFields: Array<keyof ICitated>,
    familyPatentFields: Array<keyof IFamilyPatent>
  }
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
  files: IFile[],
  fields: {
    citatingFields: Array<keyof ICitating>,
    citatedFields: Array<keyof ICitated>,
    familyPatentFields: Array<keyof IFamilyPatent>
  }
}) {
  await page.waitForSelector('.search_section')
  
  // 요약 리스트 수집
  const summaries = await getDataSummaries(page)
  await summaries.reduce(async (prevPromise, i) => {
    await prevPromise
    const details = await getDataDetails({
      applicationNumber: i.applicationNumber,
      citatingFields: params.fields.citatingFields,
      citatedFields: params.fields.citatedFields,
      familyPatentFields: params.fields.familyPatentFields
    })

    const result = {
      ...i,
      ...details?.bibliographic,
    } as IBibliographic
    
    // 출원인
    // if (details.applicants.number.charAt(0) === '1')
    const applicants = details?.applicants.map(i => Object.values(i).join(';')).join('\n') as string
    fs.appendFile(params.files.filter(i => i.name === 'patent-applicant')[0].filePath, applicants + '\n', err => err && console.log(`> saving file err`))
    
    // 서지정보
    fs.appendFile(params.files.filter(i => i.name === 'patent-bibliographic')[0].filePath, `${Object.values(result).join(';')}\n`, err => err && console.log(`> saving file err`))
    
    // 발명인
    const inventors = details?.inventors.map(i => Object.values(i).join(';')).join('\n') as string
    fs.appendFile(params.files.filter(i => i.name === 'patent-inventor')[0].filePath, inventors + '\n', err => err && console.log(`> saving file err`))
    
    // 청구항
    const claims = details?.claims.join('\n') as string
    fs.appendFile(params.files.filter(i => i.name === 'patent-claim')[0].filePath, claims + '\n', err => err && console.log(`> saving file err`))
    
    // 인용 특허
    const citating = details?.citatingPatents[0] !== '' ? details?.citatingPatents.map(i => Object.values((<any>i)).join(';')).join('\n') + '\n' as string : undefined
    console.log({citating}, citating !== undefined ? citating + '\n' : '')
    fs.appendFile(params.files.filter(i => i.name === 'patent-citating')[0].filePath, citating !== undefined ? citating : '', err => err && console.log(`> saving file err`))
    
    // 피인용 특허
    const citated = details?.citatedPatents[0] !== '' ? details?.citatedPatents.map(i => Object.values((<any>i)).join(';')).join('\n') as string : undefined
    fs.appendFile(params.files.filter(i => i.name === 'patent-citated')[0].filePath, citated !== undefined ? citated + '\n' : '', err => err && console.log(`> saving file err`))
    
    // 패밀리 특허
    const family = details?.familyPatents !== [] ? details?.familyPatents.map(i => Object.values((<any>i)).join(';')).join('\n') as string : ''
    fs.appendFile(params.files.filter(i => i.name === 'patent-family')[0].filePath, family !== '' ? family + '\n': '', err => err && console.log(`> saving file err`))
    
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
    ['applno', params.applicationNumber],
    // ['applno', '2020180005507'], // TMP: 패밀리특허
    // ['applno', '2020190004255'], // TMP: 인용특허
    // ['applno', '2020190000436'], // TMP: 피인용특허
    // ['applno', '2020190002428'], // TMP: 공개번호
    // ['applno', '2020197000068'], // TMP: 국제출원/공개
    ['link', 'N']
  ]
  const url = getURL(baseUrl, urlParams)

  try {
    const { data: html02 } = await axios.get(`${url}&next=biblioViewSub02&getType=Sub02`)

    // 인명정보
    const applicants = getApplicants(html02) // 출원인
    const inventors = getInventors(html02) // 발명인

    if (applicants.filter(i => i.number.charAt(0) === '1')) {
      const [
        { data: html01 },
        // { data: html02 },
        // { data: html03 },
        { data: html04 },
        // { data: html05 },
        { data: html06 },
        { data: html07 },
        // { data: html08 }
      ] = await Promise.all([
        delayPromise(await axios.get(`${url}&next=biblioViewSub01&getType=BASE`), 500), // 서지정보
        // delayPromise(await axios.get(`${url}&next=biblioViewSub02&getType=Sub02`), 500), // 인명정보
        // delayPromise(await axios.get(`${url}&next=biblioViewSub03&getType=Sub03`), 500), // 행정처리
        delayPromise(await axios.get(`${url}&next=biblioViewSub04&getType=Sub04`), 500), // 청구항
        // delayPromise(await axios.get(`${url}&next=biblioViewSub06&getType=Sub06`), 500), // 지정국
        delayPromise(await axios.get(`${url}&next=biblioViewSub07&getType=Sub07`), 500), // 인용/피인용
        delayPromise(await axios.get(`${url}&next=biblioViewSub08&getType=Sub08`), 500), // 패밀리특허
        // delayPromise(await axios.get(`${url}&next=biblioViewSub11&getType=Sub11`), 500) // 국가 R&D 연구정보
      ])

      // 서지정보
      const bibliographic = getBibliographic(html01)
      const ipcs = getIpcs(html01)
      const cpcs = getCpcs(html01)
      
      // // 인명정보
      // const applicants = getApplicants(html02) // 출원인
      // const inventors = getInventors(html02) // 발명인

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
      const familyPatents = getFamilyPatents(html07, params.familyPatentFields)
      
      // 국가 R&D 연구정보 
      // const document08 = parse(html08)

      const result = {
        bibliographic, // 서지정보
        ipcs, // IPC
        cpcs, // CPC
        applicants, // 출원인
        inventors, // 발명자
        claims, // 청구항
        citatingPatents, // 인용특허
        citatedPatents, // 피인용특허
        familyPatents // 패밀리특허
      }

      console.log(result)
      return result
    }
    return 
  } catch (err) {
    console.log(err)
  }
}

export async function getPatentInfo ({ startDate, endDate }: { startDate: string, endDate: string }) {
  const files = patentFiles.map(i => {
    const filePath = path.join(__dirname, '../../../outputs', `${i.name}-${startDate}-${endDate}.csv`)
    const file = fs.createWriteStream(filePath, 'utf-8')
    file.write(csvWriteHeader(i.fields))

    return {
      filePath,
      file,
      name: i.name
    }
  })
  const fields = {
    citatingFields, 
    citatedFields, 
    familyPatentFields
  }

  const params = {
    startDate, 
    endDate, 
    files,
    fields
  }

  const barl = getProgressBar()
  const { page } = await getPlaywright()

  await getList(page, barl, params)
}
