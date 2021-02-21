// import path from 'path'
// import csv from 'csvtojson'
// import fs from 'fs'
// import dotenv from 'dotenv'

// import { saveFinanceDetail } from './saveDetail'

// import { axios, csvWriteHeader, delayPromise, getURL } from '../../utils'
// // import { corpFinanceDetailFields } from '../../constants'
// import { getProgressBar } from '../../middlewares'

// dotenv.config()

// const apiKey = process.env.DATA_PORTAL_API_KEY as string
// const baseUrl = 'http://apis.data.go.kr/1160100/service/GetFinaStatInfoService/'

// async function getBs(arr: any) {
//   const data = arr.map(({ crtmAcitAmt, pvtrAcitAmt, bpvtrAcitAmt }: any) => ([ crtmAcitAmt, pvtrAcitAmt, bpvtrAcitAmt ]))

//   const result = {
//     currentAssets: data[1] ? data[1].join(',') : '',
//     nonCurrentAsset: data[6] ? data[6].join(',') : '',
//     currentLiabilities: data[2] ? data[2].join(',') : '',
//     totalEquity: data[3] ? data[3].join(',') : '',
//     issuedCapital: data[4] ? data[4].join(',') : '',
//     totalLiabilities: data[5] ? data[5].join(',') : '',
//     nonCurrentLiabilities: data[7] ? data[7].join(',') : '',
//     earningSurplus: data[8] ? data[8].join(',') : '',
//     totalAssets: data[0] ? data[0].join(',') : '',
//   }

//   return result
// }

// async function getIncoStat(arr: any) {
//   const data = arr.map(({ crtmAcitAmt, pvtrAcitAmt, bpvtrAcitAmt }: any) => ([ crtmAcitAmt, pvtrAcitAmt, bpvtrAcitAmt ]))
  
//   const result = {
//     revenue: data[0] ? data[0].join(',') : '',
//     operatingIncome: data[1] ? data[1].join(',') : '',
//     profitBeforeTax: data[2] ? data[2].join(',') : '',
//     profit: data[3] ? data[3].join(',') : '',
//   }

//   return result
// }

// async function getData({
//   corpNumber,
//   startDate
// }: {
//   corpNumber: string,
//   startDate: string
// }) {
//   const bizYear = String(Number(startDate.substr(0, 4)) -1) 
//   const [
//     { data: json01 },
//     { data: json02 }
//   ] = await Promise.all([
//     delayPromise(await axios.get(`${baseUrl}getBs?serviceKey=${apiKey}&crno=${corpNumber}&bizYear=${bizYear}&resultType=json&numOfRows=10`), 500),
//     delayPromise(await axios.get(`${baseUrl}getIncoStat?serviceKey=${apiKey}&crno=${corpNumber}&bizYear=${bizYear}&resultType=json&numOfRows=10`), 500)
//   ])

//   // if (json01.response.body.items.item.length < 1 || json02.response.body.items.item.length < 1) {
//   //   return
//   // }
//   const bs = await getBs(json01.response.body.items.item)
//   const incoStat = await getIncoStat(json02.response.body.items.item)

//   return { bs, incoStat }
// }

// export async function getFinanceInfo ({
//   startDate, 
//   endDate,
//   outputPath
// }: {
//   startDate: string,
//   endDate: string,
//   outputPath: string
// }) {
//   const filePath = `corp-${startDate}-${endDate}.csv`
  
//   const file = fs.createWriteStream(path.join(__dirname, outputPath, `finance-${startDate}-${endDate}.csv`), 'utf-8')
//   // file.write(csvWriteHeader(corpFinanceDetailFields))

//   const corpNumbers: any[] = []
//   await csv({ delimiter: ';' })
//     .fromFile(path.join(__dirname, outputPath, filePath))
//     .then(json => corpNumbers.push(json.map(i => ({
//       corpNumber: i.corpNumber,
//       applicantNumber: i.applicantNumber
//     }))))

//   const barl = getProgressBar()
  
//   await corpNumbers[0].reduce(async (prevPromise: any, i: { corpNumber: string, applicantNumber: string }, idx: number) => {
//     await prevPromise

//     barl.start(corpNumbers[0].length, idx + 1)
//     const result = await getData({ corpNumber: i.corpNumber, startDate })
//     if (result !== undefined) {
//       file.write(saveFinanceDetail(i, result), err => err && console.log(`> saving file err`))
//     }

//     return
//   }, Promise.resolve())
// }