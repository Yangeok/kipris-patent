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

async function getBs(arr: any) {
  const data = arr.map(({ acitNm, crtmAcitAmt, pvtrAcitAmt, bpvtrAcitAmt }: any) => ({ name: acitNm, crtmAcitAmt, pvtrAcitAmt, bpvtrAcitAmt }))

  const result = {
    currentAssets: data[1] ? data[1] : {},
    nonCurrentAsset: data[6] ? data[6] : {},
    currentLiabilities: data[2] ? data[2] : {},
    totalEquity: data[3] ? data[3] : {},
    issuedCapital: data[4] ? data[4] : {},
    totalLiabilities: data[5] ? data[5] : {},
    nonCurrentLiabilities: data[7] ? data[7] : {},
    earningSurplus: data[8] ? data[8] : {},
    totalAssets: data[0] ? data[0] : {},
  }

  return result
}

async function getIncoStat(arr: any) {
  const data = arr.map(({ acitNm, crtmAcitAmt, pvtrAcitAmt, bpvtrAcitAmt }: any) => ({ name: acitNm, crtmAcitAmt, pvtrAcitAmt, bpvtrAcitAmt }))
  
  const result = {
    revenue: data[0] ? data[0] : {},
    operatingIncome: data[1] ? data[1] : {},
    profitBeforeTax: data[2] ? data[2] : {},
    profit: data[3] ? data[3] : {},
  }

  return result
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
    delayPromise(await axios.get(`${baseUrl}getBs?serviceKey=${apiKey}&crno=${corpNumber}&bizYear=${bizYear}&resultType=json&numOfRows=10`), 500),
    delayPromise(await axios.get(`${baseUrl}getIncoStat?serviceKey=${apiKey}&crno=${corpNumber}&bizYear=${bizYear}&resultType=json&numOfRows=10`), 500)
  ])

  const bs = await getBs(json01.response.body.items.item)
  const incoStat = await getIncoStat(json02.response.body.items.item)

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
    .then(json => corpNumbers.push(json.map(i => ({
      corpNumber: i.corpNumber,
      applicantNumber: i.applicantNumber
    }))))

  const barl = getProgressBar()
  
  await corpNumbers[0].reduce(async (prevPromise: any, i: { corpNumber: string, applicantNumber: string }, idx: number) => {
    await prevPromise

    barl.start(corpNumbers[0].length, idx + 1)
    const result = await getData({ corpNumber: i.corpNumber, startDate })
    file.write(saveFinanceDetail(i, result), err => err && console.log(`> saving file err`))

    return
  }, Promise.resolve())
}