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