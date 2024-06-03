import type { Condition } from '@cruncheevos/core'
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

export function makeLookup(name: string, prefix: string, obj: Record<number, string>): {
  rich: string,
  point(address: number): string
}
export function givenRangeOf(start?: number, end?: number): number[]