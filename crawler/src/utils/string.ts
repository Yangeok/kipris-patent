import { URLSearchParams } from 'url'

export const getURL = (baseUrl: string, params: string[][]) => {
  const qs = new URLSearchParams()
  params.map(i => qs.set(i[0], i[1]))

  const url = `${baseUrl}${qs.toString()}`
  return url
}