export const indexToWord = (index?: number): string => {
  if (index == null) {
    return ""
  }
  if (index > 9) {
    console.error("unsupported number. supported numbers are between 1-10")
    return ""
  }
  switch (index) {
    case 0:
      return "1st"
    case 1:
      return "2nd"
    case 2:
      return "3rd"
    default:
      return `${index + 1}th`
  }
}
