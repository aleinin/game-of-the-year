import fetcher from './fetcher'

export const CSVService = {
  getCSV: async () => {
    const response = await fetch(`${fetcher.getBaseUrl()}/csv`, {
      headers: new Headers({ 'Content-Type': 'text/csv' }),
    })
    return response.text()
  },
}
