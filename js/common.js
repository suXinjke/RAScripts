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
