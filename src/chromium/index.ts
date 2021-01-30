import playwright, { Page } from 'playwright'
import { parse } from 'node-html-parser'
import axios from 'axios'

import { Indexable } from '../utils'

async function getList(page: Page) {
  await page.goto('http://kpat.kipris.or.kr/kpat/searchLogina.do?next=MainSearch')
  await page.type('#queryText', 'AD=[20100101~20210129]')
  await page.evaluate(() => {
    const { document } = (<Indexable>window)
    document.querySelector('#opt28 option[value="90"]').selected = true
  })
  await page.click('.input_btn')
  await page.click('#pageSel a')
}

async function getListData(page: Page) {
  await page.waitForSelector('.search_section')
  
  const summaries = await getDataSummary(page)
  Promise.all([
    summaries.map(async i => await getDataDetail(i.applicationNumber))
  ])

  // TODO: summary + detail
}

async function getDataSummary(page: Page) {
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

async function getDataDetail(applicationNumber: string) {
  // TODO: 서지정보
  // const { data: html01 } = await axios.get(`http://kpat.kipris.or.kr/kpat/biblioa.do?method=biblioMain_biblio&next=biblioViewSub01&applno=${applicationNumber}&getType=BASE&link=N`)
  // const document01 = parse(html01)

  /**
   * TODO: IPC, CPC, 출원일자/번호, 출원인, 등록번호/일자, 공개번호/일자
   * 공고번호/일자, 국제출원번호/일자, 국제공개번호/일자, 법적상태, 심사진행상태, 심판사항, 구분, 원출원번호/일자, 관련 출원번호, 기술이전 희망, 심사청구여부/일자
   */

  // FIXME: 인명정보
  const { data: html } = await axios.get(`http://kpat.kipris.or.kr/kpat/biblioa.do?method=biblioMain_biblio&next=biblioViewSub02&applno=${applicationNumber}&getType=Sub02&link=N`)
  const document = parse(html)

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
  const result = {
    applicants,
    inventors
  }
  console.log(result)
  
  // TODO: 행정처리 http://kpat.kipris.or.kr/kpat/biblioa.do?method=biblioMain_biblio&next=biblioViewSub03&applno=2020200003258&getType=Sub03&link=N

  // TODO: 지정국 http://kpat.kipris.or.kr/kpat/biblioa.do?method=biblioMain_biblio&next=biblioViewSub06&applno=2020200003258&getType=Sub06&link=N


  // 청구항
  const { data: html02 } = await axios.get(`http://kpat.kipris.or.kr/kpat/biblioa.do?method=biblioMain_biblio&next=biblioViewSub04&applno=${applicationNumber}&getType=Sub04&link=N`)
  const document02 = parse(html02)

  /**
   * TODO: 청구항 상세
   */

  // 인용/피인용
  const { data: html03 } = await axios.get(`http://kpat.kipris.or.kr/kpat/biblioa.do?method=biblioMain_biblio&next=biblioViewSub07&applno=${applicationNumber}&getType=Sub07&link=N`)
  const document03 = parse(html03)

  /**
   * TODO: 
   * 인용 => 국가, 공보번호, 공보일자, 발명의 명칭, IPC
   * 피인용 => 출원번호, 출원일자, 발명의 명칭, IPC
   */

  // 패밀리정보
  const { data: html04 } = await axios.get(`http://kpat.kipris.or.kr/kpat/biblioa.do?method=biblioMain_biblio&next=biblioViewSub08&applno=${applicationNumber}&getType=Sub08&link=N`)
  const document04 = parse(html04)
  
  /**
   * TODO: 
   * 국가별특허 문헌정보 => 패밀리번호, 국가코드, 국가명, 종류
   * DOCDB 패밀리정보 => 패밀리번호, 국가코드, 국가명, ㅈ오류
   */

   // TODO: 국가 R&D 연구정보 http://kpat.kipris.or.kr/kpat/biblioa.do?method=biblioMain_biblio&next=biblioViewSub11&applno=2020200003258&getType=Sub11&link=N

   /**
    * TODO: 
    * 연구부처, 주관기관, 연구사업, 연구과제
    */
}

(async function() {
  const browser = await playwright.chromium.launch({
    headless: false
  })
  const context = await browser.newContext()
  const page = await context.newPage()
  await getList(page)
  await getListData(page)
})()