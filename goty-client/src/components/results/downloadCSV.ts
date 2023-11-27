export interface Column<T> {
  label: string
  accessorFn?: (obj: T) => any
  accessorKey?: keyof T
}
export interface Section<T> {
  title?: string
  columns: Column<T>[]
  data: T[] | T
}

const TEXT_CSV = 'text/csv'
type CSV = any[][]
export const downloadCSV = (fileName: string, sections: Section<any>[]) => {
  const csvString = getCSVData(sections)
  const blob = new Blob([csvString], {
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

const getCSVData = (sections: Section<any>[]): string => {
  const rows: CSV = []
  sections.forEach((section) => {
    addSection(rows, section.columns, section.data, section.title)
    addEmptyRow(rows)
  })
  padRowsWithCorrectNumberOfColumns(rows)
  return rows.map((row) => row.join(',')).join('\n')
}

const addSection = <T>(
  rows: CSV,
  columns: Column<T>[],
  data: T[] | T,
  title?: string,
) => {
  title && rows.push([cell(title)])
  rows.push(columns.map((column) => cell(column.label)))
  const addRow = (dataRow: T) => {
    const row: any[] = []
    columns.forEach((column) => {
      if (column.accessorKey != null) {
        row.push(cell(dataRow[column.accessorKey]))
      } else if (column.accessorFn != null) {
        row.push(cell(column.accessorFn(dataRow)))
      } else {
        row.push(cell(dataRow))
      }
    })
    rows.push(row)
  }
  if (Array.isArray(data)) {
    data.forEach(addRow)
  } else {
    addRow(data)
  }
}
const cell = (content: any) => `"${content}"`

const addEmptyRow = (rows: CSV) => rows.push([])

const padRowsWithCorrectNumberOfColumns = (rows: CSV) => {
  const numberOfColumns = rows.reduce(
    (mostColumns: number, columns: any[]) =>
      columns.length > mostColumns ? columns.length : mostColumns,
    0,
  )
  rows.forEach((row) => {
    while (row.length < numberOfColumns) {
      row.push('')
    }
  })
}
