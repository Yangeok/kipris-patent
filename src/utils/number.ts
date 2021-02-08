export const currenyFormatter = (str: string) => {
  if (str.includes('백만')) {
    return Math.round(Number(str.replace(/\s/g, '').replace(/\,/g, '').split('백만')[0]) * 1_000_000)
  }
  
  if (str.includes('억')) {
    return Math.round(Number(str.replace(/\s/g, '').replace(/\,/g, '').split('억')[0]) * 100_000_000)
  }
  
  if (str.includes('조')) {
    return Math.round(Number(str.replace(/\s/g, '').replace(/\,/g, '').split('조')[0]) * 1_000_000_000_000)
  }
}