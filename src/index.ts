import moment from 'moment'

import { getCorpInfo, getPatentInfo } from './crawler'

(async function () {
  const startDate = '20200101'
  const endDate = moment(new Date).format('YYYYMMDD')
  
  // await getPatentInfo({ startDate, endDate })
  await getCorpInfo({ startDate, endDate })
})()