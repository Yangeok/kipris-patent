import { getCorpInfo, getPatentInfo } from './crawler'

(async function () {
  const startDate = '20200501'
  const endDate = '20200630'
  const outputPath = '../../../../outputs'
  const startPage = 1

  // await getPatentInfo({ startDate, endDate, outputPath, startPage })
  await getCorpInfo({ startDate, endDate, outputPath })
})()