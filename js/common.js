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

export function asciiToNumberLE(str) {
  if (str.length > 4) {
    throw new Error('expected length of string to be less or equal to 4')
  }

  const val = str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).reverse().join('')

  return Number('0x' + val)
}

export function makeRichPresenceLookup(params) {
  let rich = `Lookup:${params.name}`
  for (const inputKey in params.values) {
    const keyNumber = Number(inputKey)
    const key =
      Number.isNaN(keyNumber) ? inputKey :
        params.keyFormat === 'dec' ? keyNumber :
          keyNumber.toHexString().toUpperCase().padStart(2, '0')

    rich += `\n${key}=${params.values[inputKey]}`
  }

  return {
    name: params.name,
    toString() {
      return rich
    },
    point(input) {
      return `@${params.name}(${input.toString()})`
    },
    defaultPoint() {
      if (!params.defaultAddress) {
        throw new Error('default address not set')
      }
      return params.defaultAddress
    }
  }
}

export function makeRichPresenceDisplay(...args) {
  const condition = args.length >= 2 ? `?${args[0]}?` : ''
  const value = args.length >= 2 ? args[1] : args[0]

  return condition + value
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
