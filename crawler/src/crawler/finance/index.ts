import path from 'path'
import csv from 'csvtojson'
import fs from 'fs'
import dotenv from 'dotenv'

import { saveFinanceDetail } from './saveDetail'

import { axios, csvWriteHeader, delayPromise, getURL } from '../../utils'
import { corpFinanceDetailFields } from '../../constants'
import { getProgressBar } from '../../middlewares'

dotenv.config()

const apiKey = process.env.DATA_PORTAL_API_KEY as string
const baseUrl = 'http://apis.data.go.kr/1160100/service/GetFinaStatInfoService/'

async function getAcitAmt(json: any) {
//   [
//     '자산총계',
//     '유동자산',
//     '유동부채',
//     '자본총계',
//     '자본금',
//     '부채총계',
//     '비유동자산',
//     '비유동부채',
//     '이익잉여금(결손금)',
//     '자산총계'
//   ]
//   [
//   '영업이익',
//   '당기순이익(손실)',
//   '법인세비용차감전순이익(손실)',
//   '매출액',
//   '영업이익',
//   '당기순이익(손실)',
//   '법인세비용차감전순이익(손실)',
//   '매출액'
// ]
  const bs = [
    '자산총계',
    '유동자산',
    '유동부채',
    '자본총계',
    '자본금',
    '부채총계',
    '비유동자산',
    '비유동부채',
    '이익잉여금(결손금)',
    '자산총계'
  ]
  const incoStat = [
    '영업이익',
    '당기순이익(손실)',
    '법인세비용차감전순이익(손실)',
    '매출액',
    '영업이익',
    '당기순이익(손실)',
    '법인세비용차감전순이익(손실)',
    '매출액'
  ]
  return {
    crtmAcitAmt: json.crtmAcitAmt ? json.crtmAcitAmt : '',
    pvtrAcitAmt: json.pvtrAcitAmt ? json.pvtrAcitAmt : '',
    bpvtrAcitAmt: json.pvtrAcitAmt ? json.pvtrAcitAmt : '',
  }
}

async function getData({
  corpNumber,
  startDate
}: {
  corpNumber: string,
  startDate: string
}) {
  const bizYear = String(Number(startDate.substr(0, 4)) -1) 
  const [
    { data: json01 },
    { data: json02 }
  ] = await Promise.all([
    delayPromise(await axios.get(`${baseUrl}getBs?serviceKey=${apiKey}&crno=1101112095837&bizYear=${bizYear}&resultType=json&numOfRows=10`), 500),
    delayPromise(await axios.get(`${baseUrl}getIncoStat?serviceKey=${apiKey}&crno=1101112095837&bizYear=${bizYear}&resultType=json&numOfRows=10`), 500)
  ])
  console.log(json01.response.body.items.item)
  console.log(json02.response.body.items.item)

  const bs = await getAcitAmt(json01.response.body.items.item)
  const incoStat = await getAcitAmt(json02.response.body.items.item)

  return { bs, incoStat }
}

export async function getFinanceInfo ({
  startDate, 
  endDate,
  outputPath
}: {
  startDate: string,
  endDate: string,
  outputPath: string
}) {
  const filePath = `corp-${startDate}-${endDate}.csv`
  
  const file = fs.createWriteStream(path.join(__dirname, outputPath, `finance-${startDate}-${endDate}.csv`), 'utf-8')
  file.write(csvWriteHeader(corpFinanceDetailFields))

  const corpNumbers: any[] = []
  await csv({ delimiter: ';' })
    .fromFile(path.join(__dirname, outputPath, filePath))
    .then(json => corpNumbers.push(json.map(i => i.corpNumber)))

  const barl = getProgressBar()
  await corpNumbers.reduce(async (prevPromise: any, i: any, idx: number) => {
    await prevPromise
    barl.start(corpNumbers[0].length, idx)
    const result = await getData({ corpNumber: i[idx], startDate })
    
    if (result) {
      file.write(saveFinanceDetail(i[idx], result), err => err && console.log(`> saving file err`))
    }
    return result
  }, Promise.resolve())
}