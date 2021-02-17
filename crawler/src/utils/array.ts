import { Indexable } from "./types"

export const fromEntries = (iter: any)  => {
  return [...iter].reduce((obj, [key, val]) => {
    obj[key] = val
    return obj
  }, {} as any)
}