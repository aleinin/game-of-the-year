export const buildYearsGrammar = (years: number[]): string => {
  if (years.length === 0) {
    console.error('empty years when trying to build years grammar')
    return ''
  }

  const sortedYears = [...years].sort((a, b) => a - b)

  const summarizedYears: string[] = []
  let start = sortedYears[0]
  let end = sortedYears[0]

  for (let i = 1; i < sortedYears.length; i++) {
    if (sortedYears[i] === end + 1) {
      end = sortedYears[i]
    } else {
      summarizedYears.push(start === end ? `${start}` : `${start}-${end}`)
      start = sortedYears[i]
      end = sortedYears[i]
    }
  }

  summarizedYears.push(start === end ? `${start}` : `${start}-${end}`)

  if (summarizedYears.length === 1) {
    return summarizedYears[0]
  } else if (summarizedYears.length === 2) {
    return `${summarizedYears[0]} or ${summarizedYears[1]}`
  } else {
    const last = summarizedYears.pop()
    return `${summarizedYears.join(', ')}, or ${last}`
  }
}
