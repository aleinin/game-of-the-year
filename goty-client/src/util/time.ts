const toTwelveHourString = (
  twentyFourHour: number,
  minutes: number
): string => {
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`
  let twelveHour
  let period: 'AM' | 'PM'
  if (twentyFourHour >= 12) {
    period = 'PM'
    twelveHour = twentyFourHour === 12 ? 12 : twentyFourHour - 12
  } else {
    period = 'AM'
    twelveHour = twentyFourHour === 0 ? 12 : twentyFourHour
  }
  return `${twelveHour}:${minutesString}${period}`
}

export const dateStringToTwelveHourString = (dateString: string) => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  const time = toTwelveHourString(date.getHours(), date.getMinutes())
  return `${month}/${day}/${year} ${time}`
}
