export const delayPromise = <T>(value: T, milliseconds: number): Promise<T> => {
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