import { SingleBar } from 'cli-progress'
import { Page } from 'playwright'
import path from 'path'
import fs from 'fs'

import { getBibliographic, getApplicants, getCpcs, getCitatedPatents, getCitatingPatents, getClaims, getFamilyPatents, getInventors, getIpcs, getDataSummaries, getContentCount } from './getDetail'

import { csvWriteHeader, Indexable, delayPromise, getURL, axios } from '../../utils'
import { getProgressBar, getPlaywright } from '../../middlewares'
import { IBibliographic, ICitating, ICitated, IFamilyPatent, IFile } from '../../interfaces'
import { patentFiles, citatingFields, citatedFields, familyPatentFields, } from '../../constants'

async function getList(page: Page, barl: SingleBar, params: {
  startDate: string, 
  endDate: string, 
  startPage: number,
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
    await page.type('#queryText', `GD=[${params.startDate}~${params.endDate}]`),
    await page.click('.input_btn')
  ])
  
  // 필터 선택후 클릭
  await page.evaluate(() => {
    const { document } = (<Indexable>window)
    document.querySelector('#opt28 option[value="30"]').selected = true
  })
  await page.click('#pageSel img')
  await page.click('#pageSel a')
  await page.waitForSelector('#loadingBarBack', { state: 'hidden' })

  // 페이지 카운트
  const contentsCount = await getContentCount(page)

  let currentPage = contentsCount.currentPage
  while (currentPage < contentsCount.totalPage) {
    barl.start(contentsCount.totalPage, currentPage)
    await page.waitForSelector('.board_pager03')
    
    fs.writeFile('../current_page.log', `currentPage: ${String(currentPage)}`, err => err && console.log(err))

    if (params.startPage >= currentPage) {
      Promise.all([
        await page.$eval('.board_pager03 strong', el => (el.nextElementSibling as HTMLElement).click()),
        await page.waitForSelector('#loadingBarBack', { state: 'hidden' })
      ])
    } else {
      Promise.all([
        await getListData(page, params),
        await page.$eval('.board_pager03 strong', el => (el.nextElementSibling as HTMLElement).click()),
        await page.waitForSelector('#loadingBarBack', { state: 'hidden' }),
      ])
    }
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
  },
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
    
    if (details?.applicants === undefined) {
      return
    }
    Array.from({ length: details?.applicants.length }).map((_, idx) => {
      const result = {
        ...i,
        ...details?.bibliographic,
        // applicants: JSON.stringify(details?.applicants),
        applicantNumber: details?.applicants[idx].number,
        applicantName: details?.applicants[idx].name,
        // inventors: JSON.stringify(details?.inventors),
        // claims: JSON.stringify(details?.claims),
        // ipcs: JSON.stringify(details?.ipcs),
        // cpcs: JSON.stringify(details?.cpcs),
        // citatingPatents: JSON.stringify(details?.citatingPatents),
        // citatedPatents: JSON.stringify(details?.citatedPatents),
        // familyPatents: JSON.stringify(details?.familyPatents)
        ipcCode_1: details?.ipcs.ipcCode_1 || '',
        ipcCode_2: details?.ipcs.ipcCode_2 || '',
        ipcCode_3: details?.ipcs.ipcCode_3 || '',
        ipcCode_4: details?.ipcs.ipcCode_4 || '',
        ipcCode_5: details?.ipcs.ipcCode_5 || '',

        cpcCode_1: details.cpcs.cpcCode_1 || '',
        cpcCode_2: details.cpcs.cpcCode_2 || '',
        cpcCode_3: details.cpcs.cpcCode_3 || '',
        cpcCode_4: details.cpcs.cpcCode_4 || '',
        cpcCode_5: details.cpcs.cpcCode_5 || '',

        citatingIpcCode_1: details.citatingPatents.citatingIpcCode_1 || '',
        citatingIpcCode_2: details.citatingPatents.citatingIpcCode_2 || '',
        citatingIpcCode_3: details.citatingPatents.citatingIpcCode_3 || '',
        citatingIpcCode_4: details.citatingPatents.citatingIpcCode_4 || '',
        citatingIpcCode_5: details.citatingPatents.citatingIpcCode_5 || '',
        
        citatedIpcCode_1: details.citatedPatents.citatedIpcCode_1 || '',
        citatedIpcCode_2: details.citatedPatents.citatedIpcCode_2 || '',
        citatedIpcCode_3: details.citatedPatents.citatedIpcCode_3 || '',
        citatedIpcCode_4: details.citatedPatents.citatedIpcCode_4 || '',
        citatedIpcCode_5: details.citatedPatents.citatedIpcCode_5 || '',
        
        familyNumber_1: details.familyPatents.familyNumber_1 || '',
        familyNumber_2: details.familyPatents.familyNumber_2 || '',
        familyNumber_3: details.familyPatents.familyNumber_3 || '',
        familyNumber_4: details.familyPatents.familyNumber_4 || '',
        familyNumber_5: details.familyPatents.familyNumber_5 || ''
      } as IBibliographic       
      
      fs.appendFile(params.files[0].filePath, `${Object.values(result).join(';')}\n`, err => err && console.log(`> saving file err`))
    })

    return
  }, <any>Promise.resolve())
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
    ['link', 'N']
  ]
  const url = getURL(baseUrl, urlParams)

  try {
    const [{ data: html02 }] = await Promise.all([delayPromise(await axios.get(`${url}&next=biblioViewSub02&getType=Sub02`), 500)])

    // 인명정보
    const applicants = getApplicants(html02) // 출원인
    const inventors = getInventors(html02) // 발명인

    if (applicants.filter(i => i.number.charAt(0) === '1').length > 0) {
      const [
        { data: html01 },
        // { data: html02 },
        // { data: html03 },
        // { data: html04 },
        // { data: html05 },
        { data: html06 },
        { data: html07 },
        // { data: html08 }
      ] = await Promise.all([
        delayPromise(await axios.get(`${url}&next=biblioViewSub01&getType=BASE`), 500), // 서지정보
        // delayPromise(await axios.get(`${url}&next=biblioViewSub02&getType=Sub02`), 500), // 인명정보
        // delayPromise(await axios.get(`${url}&next=biblioViewSub03&getType=Sub03`), 500), // 행정처리
        // delayPromise(await axios.get(`${url}&next=biblioViewSub04&getType=Sub04`), 500), // 청구항
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
      // const claims = getClaims(html04)
    
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
        // inventors, // 발명자
        // claims, // 청구항
        citatingPatents, // 인용특허
        citatedPatents, // 피인용특허
        familyPatents // 패밀리특허
      }

      return result
    }
    return 
  } catch (err) {
    console.log(err)
  }
}

export async function getPatentInfo ({ 
  startDate, 
  endDate, 
  outputPath, 
  startPage 
}: { 
  startDate: string, 
  endDate: string, 
  outputPath: string, 
  startPage: number 
}) {
  const files = patentFiles.map(i => {
    const filePath = path.join(__dirname, outputPath, `${i.name}-${startDate}-${endDate}.csv`)
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
    fields,
    startPage
  }

  const barl = getProgressBar()
  const { page } = await getPlaywright()

  await getList(page, barl, params)
}
