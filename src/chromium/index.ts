import playwright from 'playwright'
import { Indexable } from '../utils'

async function getList(page: playwright.Page) {
  await page.goto('http://kpat.kipris.or.kr/kpat/searchLogina.do?next=MainSearch')
  await page.type('#queryText', 'AD=[20100101~20210129]')
  await page.evaluate(() => {
    const { document } = (<Indexable>window)
    document.querySelector('#opt28 option[value="90"]').selected = true
  })
  await page.click('.input_btn')
  await page.click('#pageSel a')
}

async function getListData(page: playwright.Page, context: playwright.ChromiumBrowserContext) {
  await page.waitForSelector('.search_section')
  
  const summaries = await getDataSummary(page)
  const details = await getDataDetail(page, context)

  // console.log({ summaries })
}

async function getDataSummary(page: playwright.Page) {
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

async function getDataDetail(page: playwright.Page, context: playwright.ChromiumBrowserContext) {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.evaluate(() => (document.querySelector('article[id^="divView"] .stitle a[title="새창으로 열림"]') as HTMLElement).click())
  ])

  console.log(await newPage)
  await newPage.click('#liViewSub02 a')
  
  // FIXME: timeout 둘 중에 하나 고르기
  await newPage.waitForTimeout(500)
  // await newPage.waitForSelector('#divBiblioContent')
  
  const data = await newPage.evaluate(() => {

    // REF: 
    // [...$$('td.name')].map(i => i.innerText)
    // [...$$('td.nationality')].map(i => i.innerText)
    // [...$$('td.nationality')].map(i => i.innerText)
    // [...$$('td.txt_left')].map(i => i.innerText)

    // FIXME: table 변수 작동시키기
    // [...$$('.tstyle_list')].map(i => i.querySelector('tbody .name')?.innerText)
    const table = document.querySelectorAll('.tstyle_list')
    console.log({ table })
    return {
      applicant: ((Array.from(document.querySelectorAll('.tstyle_list')) as HTMLElement[])[0].querySelector('tbody .name') as HTMLElement)?.innerText,
      applicantNationality: ((Array.from(document.querySelectorAll('.tstyle_list')) as HTMLElement[])[0].querySelector('tbody .nationality') as HTMLElement)?.innerText,
      applicantAddress: ((Array.from(document.querySelectorAll('.tstyle_list')) as HTMLElement[])[0].querySelector('tbody .txt_left') as HTMLElement)?.innerText,
      inventor: ((Array.from(document.querySelectorAll('.tstyle_list')) as HTMLElement[])[1].querySelector('tbody .name') as HTMLElement)?.innerText,
      inventorNationality: ((Array.from(document.querySelectorAll('.tstyle_list')) as HTMLElement[])[0].querySelector('tbody .nationality') as HTMLElement)?.innerText,
      inventorAddress: ((Array.from(document.querySelectorAll('.tstyle_list')) as HTMLElement[])[0].querySelector('tbody .txt_left') as HTMLElement)?.innerText
    }
  })
}

(async function() {
  const browser = await playwright.chromium.launch({
    headless: false
  })
  const context = await browser.newContext()
  const page = await context.newPage()
  await getList(page)
  await getListData(page, context)
})()