export function desensitize(str) {
  if (!str) return ''
  return str.toString().replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}
