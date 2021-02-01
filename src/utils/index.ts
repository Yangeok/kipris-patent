export interface Indexable {
  [k: string]: any
}

export const csvWriteStream = () => {
  // easier way
}

export const jsonWriteStream = () => {
  /**
   * REF: https://stackoverflow.com/questions/17556156/how-to-append-to-a-stringified-json-array-using-fs-createwritestream-with-node
   * way 1
   * mongodb
   * 
   * way 2
   * bunyan
   * 
   * REF: https://stackoverflow.com/questions/45712457/nodejs-parse-json-file-transform-the-input-and-write-to-file-as-json-array
   * way 3
   * appending string
   * 
   * REF: https://stackoverflow.com/questions/54541196/append-json-to-a-file-using-node-streams
   * way 4
   * scramjet
   * 
   * REF: https://stackoverflow.com/questions/50747537/how-to-append-json-data-to-existing-json-file-node-js
   * way 5
   * parse to json, and then push new array to json
   * 
   * REF: https://stackoverflow.com/questions/42896447/parse-large-json-file-in-nodejs-and-handle-each-object-independently
   * way 6
   * stream-json
   */
}