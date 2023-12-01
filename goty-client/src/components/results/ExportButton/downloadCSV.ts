const TEXT_CSV = 'text/csv'
export const downloadCSV = async (fileName: string, csv: string) => {
  const blob = new Blob([csv], {
    type: TEXT_CSV,
  })
  const aTag = document.createElement('a')
  aTag.download = fileName
  aTag.href = window.URL.createObjectURL(blob)
  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  aTag.dispatchEvent(clickEvent)
  aTag.remove()
}
