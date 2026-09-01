import * as path from 'path'
import * as fs from 'fs'
import type { Condition, ConditionBuilder } from '@cruncheevos/core'

export type ArrayValue<T> = T extends (infer U)[] ? U : never
export type ObjectValue<T> = T extends (Record<string, infer U>) ? U : never

export type Unpromisify<T> = T extends Promise<infer U> ? U : T;

export function mapObject<T extends object, NewValue>(
  input: T,
  cb: (value: T[keyof T], key: string) => NewValue
) {
  const res = {} as Record<keyof T, NewValue>

  for (const key in input) {
    res[key] = cb(input[key], key)
  }

  return res
}

export function mapNumberedObject<T extends object, NewValue>(
  input: T,
  cb: (value: T[keyof T], key: number) => NewValue
) {
  const res = {} as Record<keyof T, NewValue>

  for (const key in input) {
    const numKey = Number(key)
    if (Number.isNaN(numKey)) {
      throw new Error(`got NaN: ${key}`)
    }

    res[key] = cb(input[key], numKey)
  }

  return res
}

export function arrayToObject<O>(input: O[], cb: (o: O) => string | number) {
  return input.reduce((prev, cur) => {
    prev[cb(cur)] = cur
    return prev
  }, {} as Record<string, O>)
}

export function altsFromArray(...args: Array<Condition.Group>) {
  return args.reduce((prev, cur, i) => {
    prev[i === 0 ? 'core' : `alt${i}`] = cur
    return prev
  }, {} as Condition.GroupSetObject)
}

export function makeMultiRegionalConditionsFunction<O extends Record<string, O[keyof O]>>(obj: O, opts?: { alwaysTrueCondition?: string | ConditionBuilder }) {
  function multiRegionalConditions(cb: (c: O[keyof O], r: keyof O) => ConditionBuilder) {
    const { alwaysTrueCondition = 'hcafe=hcafe' } = opts || {}

    return altsFromArray(
      alwaysTrueCondition,
      ...Object.entries(obj).map(([r, code]) => cb(code, r))
    )
  }

  multiRegionalConditions.coreIncluded = function (cb: (c: O[keyof O], r: keyof O) => ConditionBuilder) {
    return altsFromArray(
      ...Object.entries(obj).map(([r, code]) => cb(code, r))
    )
  }

  multiRegionalConditions.altsOnly = function (cb: (c: O[keyof O], r: keyof O) => ConditionBuilder) {
    const res = multiRegionalConditions(cb)
    delete res.core
    return res
  }

  multiRegionalConditions.severalAltsPerRegion = function (cb: (c: O[keyof O], r: keyof O) => Condition.GroupSetObject) {
    const { alwaysTrueCondition = 'hcafe=hcafe' } = opts || {}

    return altsFromArray(
      alwaysTrueCondition,
      ...Object.entries(obj).flatMap(([r, code]) => {
        const { core, ...rest } = cb(code, r)
        return Object.values(rest)
      })
    )
  }

  multiRegionalConditions.toArray = function (cb: (c: O[keyof O], r: keyof O) => ConditionBuilder | ConditionBuilder[]) {
    return Object.entries(obj).flatMap(([r, code]) => cb(code, r))
  }

  return multiRegionalConditions
}

export function givenRangeOf(start = 0, end = 0) {
  return Array.from({ length: end - start + 1 }, (v, k) => start + k)
}

function tsvParse(tsv: string) {
  return tsv.split('\r\n').map(x => x.split('\t')).slice(1)
}

export async function getParsedSheet(
  rootDir: string,
  id: string,
  linksFileName = 'links',
  subDir = ''
) {
  const tmpDir = path.join(rootDir, 'tmp')
  const links = JSON.parse(fs.readFileSync(path.join(rootDir, `./${linksFileName}.json`)).toString())
  const forceRefetch = process.argv.includes('refetch')

  const shouldRefetch = forceRefetch &&
    (process.argv.includes(id) || process.argv.includes('all'))

  const filePath = path.join(tmpDir, subDir, `${id}.tsv`)
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