import type { Condition, ConditionBuilder } from '@cruncheevos/core'

declare global {
  interface Number {
    toHexString(): string
  }

  interface String {
    removeQuotesFromHex(): string
    toHexString(): string
  }
}

export function givenRangeOf(start?: number, end?: number): number[]

export function getParsedSheet(rootDir: string, id: string): Promise<string[][]>