import moment from 'moment'

import { getCorpInfo, getPatentInfo, getFinanceInfo } from './crawler'

(async function () {
  const startDate = '20200101'
  const endDate = '20201231' // moment(new Date).format('YYYYMMDD')
  const outputPath = '../../../../outputs'
  const startPage = 1

  // await getPatentInfo({ startDate, endDate, outputPath, startPage })
  // await getCorpInfo({ startDate, endDate, outputPath })
  await getFinanceInfo({ startDate, endDate, outputPath })
})()