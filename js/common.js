import { ConditionBuilder } from '@cruncheevos/core'

export function makeLookup(name, prefix, obj) {
  let rich = `Lookup:${name}\n`
  for (const key in obj) {
    rich += `0x${Number(key).toString(16).toUpperCase().padStart(2, '0')}=${obj[key]}\n`
  }

  return {
    rich,
    point(address) {
      return `@${name}(0x${prefix}${address.toString(16).toUpperCase()})`
    }
  }
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

ConditionBuilder.prototype.withLast = function (data) {
  return this.map((c, idx, array) => {
    if (idx !== array.length - 1) {
      return c
    }

    return c.with(data)
  })
}