import { getCorpInfo, getPatentInfo } from './crawler'

(async function () {
  const startDate = '20200101'
  const endDate = '20201231'
  const outputPath = '../../../../outputs'
  const startPage = 1

  // await getPatentInfo({ startDate, endDate, outputPath, startPage })
  await getCorpInfo({ startDate, endDate, outputPath })
})()