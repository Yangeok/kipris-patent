import { parse } from 'node-html-parser'
import fromEntries from 'fromentries'

export const getBibliographic = (html: any) => {
  const newDocument = parse(html)
  
  const tableData = [...(newDocument).querySelectorAll('.detial_plan_info strong')].map(i => 
    i.nextElementSibling !== null 
    ? i.nextElementSibling.innerText.replace(/\n/g, '').replace(/\t/g, '').replace(/  /g, '')
    : i.nextSibling.textContent.replace(/\n/g, '').replace(/\s/g, '')
  )

  const bibliographic = {
    registerNumber: tableData[4].split('(')[0], // 등록번호
    registerDate: tableData[4].split('(')[1] !== undefined ? tableData[4].split('(')[1]?.replace(')', '').replace(/\./g, '-') : '', // 등록일자
    publishNumber: tableData[5].split('(')[0], // 공개번호
    publishDate: tableData[5].split('(')[1] !== undefined ? tableData[5].split('(')[1]?.replace(')', '').replace(/\./g, '-') : '', // 공개일자
    // publishNumber: [...(newDocument).querySelectorAll('.detial_plan_info li')][5].innerText.split('(65) 공개번호/일자 ')[1] !== undefined ? [...(newDocument).querySelectorAll('.detial_plan_info li')][5].innerText.split('(65) 공개번호/일자 ')[1].split(' (')[0].replace(/\n/g, '').replace(/\t/g, '').replace(/[^0-9]/g, '') : '', // 공개번호
    // publishDate: [...(newDocument).querySelectorAll('.detial_plan_info li')][5].innerText.split('(65) 공개번호/일자 ')[1].split(' (')[1] !== undefined ? [...(newDocument).querySelectorAll('.detial_plan_info li')][5].innerText.split('(65) 공개번호/일자 ')[1].split(' (')[1].replace(/\./g, '-').replace(')', '').replace(/\n/g, '').replace(/\t/g, ''): '', // 공개일자
    // 공고번호
    // 공고일자
    intlApplNumber: tableData[8].split('(')[0] !== undefined ? tableData[8].split('(')[0]: '', // 국제출원번호
    intlApplDate: tableData[8].split('(')[1] !== undefined ? tableData[8].split('(')[1]?.replace(/\./g, '-').replace(')', '') : '', // 국제출원일자
    intlPublishNumber: tableData[9].split('(')[0], // 국제공개번호
    intlPublishDate: tableData[9].split('(')[1] !== undefined ? tableData[9].split('(')[1].replace(/\./g, '-').replace(')', '') : '', // 국제공개일자
    // 심사진행상태
    // 심판사항
    // 특허구분
    // 기술이전희망여부
    claimReqDate: tableData[18].split('(')[1] !== undefined ? tableData[18].split('(')[1].replace(/\./g, '-').replace(')', '') : '',// 심사청구일자
    claimCount: tableData[19] !== undefined ? tableData[19].replace(/\t/g, '').replace(/\n/g, ''): '', // 청구항수
    astrtCont: String(newDocument.querySelector('p[num="0001a"]').innerText.replace(/\n/g, '').replace(/\;/g, '')) // 요약
  }
  return bibliographic
}
export const getIpcs = (html: any) => {
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
export const getCpcs = (html: any) => {
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
export const getApplicants = (html: any) => {
  const newDocument = parse(html)

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
export const getInventors = (html: any) => {
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
export const getClaims = (html: any) => {
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
export const getCitatingPatents = (html: any, header: string[]) => {
  const newDocument = parse(html)
  
  const citatingValues = [...[...newDocument.querySelectorAll('.tstyle_list')][0].querySelectorAll('tbody tr')]
    .map(i => [...i.querySelectorAll('td')]
      .map((j, idx) => 
        idx === 2
        ? j.innerText.replace(/\./g, '-')
        : j.innerText.replace(/\n/g, '').replace(/  /g, '').replace(/\t/g, '')
      ))
  const citating = citatingValues
  .map(i => i.length > 1 ? fromEntries(i.map((j, index) => ([ header[index], j ]))) : '')
  
  return citating[0] !== '' ? citating : []
}
export const getCitatedPatents = (html: any, header: string[]) => {
  const newDocument = parse(html)
  
  const citatedValues  = [...[...newDocument.querySelectorAll('.tstyle_list')][1].querySelectorAll('tbody tr')]
    .map(i => [...i.querySelectorAll('td')]
      .map((j, idx) => 
        idx === 1
        ? j.innerText.replace(/\./g, '-')
        : j.innerText.replace(/\n/g, '').replace(/  /g, '').replace(/\t/g, '')
      ))
  const citated = citatedValues
    .map(i => i.length > 1 ? fromEntries(i.map((j, index) => ([ header[index], j ]))): '')

  return citated[0] !== '' ? citated : []
}
export const getFamilyPatents = (html: any, header: string[]) => {
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