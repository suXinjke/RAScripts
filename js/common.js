import * as path from 'path'
import * as fs from 'fs'

export function asciiToNumberLE(str) {
  if (str.length > 4) {
    throw new Error('expected length of string to be less or equal to 4')
  }

  const val = str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).reverse().join('')

  return Number('0x' + val)
}

export function givenRangeOf(start = 0, end = 0) {
  return Array.from({ length: end - start + 1 }, (v, k) => start + k)
}

Number.prototype.toHexString = function () {
  return '0x' + this.toString(16)
}

String.prototype.removeQuotesFromHex = function () {
  return this.replace(/"(0x[\dABCDEF]+)"/gi, "$1")
}

String.prototype.toHexString = function () {
  return Number(this).toHexString()
}

function tsvParse(tsv) {
  return tsv.split('\r\n').map(x => x.split('\t')).slice(1)
}

export async function getParsedSheet(rootDir, id) {
  const tmpDir = path.join(rootDir, 'tmp')
  const links = JSON.parse(fs.readFileSync(path.join(rootDir, './links.json')).toString())
  const forceRefetch = process.argv.includes('refetch')

  const shouldRefetch = forceRefetch &&
    (process.argv.includes(id) || process.argv.includes('all'))

  const filePath = path.join(tmpDir, `${id}.tsv`)
  if (fs.existsSync(filePath) && shouldRefetch === false) {
    const tsv = fs.readFileSync(filePath).toString()
    return tsvParse(tsv)
  }

  const link = links[id]
  if (!link) {
    throw new ReferenceError(`no link ${id} defined`)
  }

  console.log(`fetching and caching ${id}`)
  const res = await fetch(link).then(x => x.text())

  fs.writeFileSync(filePath, res)
  return tsvParse(res)
}