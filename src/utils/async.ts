export const delayPromise = (value: any, milliseconds: number): Promise<any> => {
  return new Promise(resolve => setTimeout(resolve, milliseconds, value))
}

export const sleep = (milliseconds: number) => {
  let start = new Date().getTime()

  for (let i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break
    }
  }
}