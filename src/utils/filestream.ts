export const csvWriteHeader = (fields: string[]) => {
  return `${fields.join(';')}\n`
}