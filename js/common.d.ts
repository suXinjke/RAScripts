import type { Condition, ConditionBuilder } from '@cruncheevos/core'
import type { DeepPartial } from '@cruncheevos/core/util'

declare global {
  interface Number {
    toHexString(): string
  }

  interface String {
    removeQuotesFromHex(): string
    toHexString(): string
  }
}

declare module '@cruncheevos/core' {
  interface ConditionBuilder {
    withLast(data: DeepPartial<Condition.Data>): ConditionBuilder
  }
}

export function makeRichPresenceDisplay(value: string): string
export function makeRichPresenceDisplay(
  condition: string | Condition | ConditionBuilder,
  value: string
): string

export function asciiToNumberLE(str: string): number

export function makeRichPresenceLookup(params: {
  name: string,
  keyFormat?: 'hex' | 'dec',
  values: Record<string | number, string>,
  defaultAddress?: string | Condition | ConditionBuilder
}): {
  toString(): string
  point(address: string | Condition | ConditionBuilder): string
}

export function makeLookup(name: string, prefix: string, obj: Record<number, string>): {
  rich: string,
  point(address: number): string
}
export function givenRangeOf(start?: number, end?: number): number[]