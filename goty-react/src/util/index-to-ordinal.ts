const isInteger = (val: any): val is number => Number.isInteger(val)

export const indexToOrdinal = (index: any): string => {
  if (!isInteger(index) || (isInteger(index) && index < 0)) {
    return ''
  }
  const num = index + 1
  const mod10 = num % 10
  switch (mod10) {
    case 1:
      return `${num}${num % 100 !== 11 ? 'st' : 'th'}`
    case 2:
      return `${num}${num % 100 !== 12 ? 'nd' : 'th'}`
    case 3:
      return `${num}${num % 100 !== 13 ? 'rd' : 'th'}`
    default:
      return `${num}th`
  }
}
