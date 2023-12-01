interface Constants {
  baseUrl?: string
}

export const baseUrlService = {
  getBaseUrl: async (): Promise<string | undefined> => {
    const url = `${window.location.origin}/constants.json`
    let response = await fetch(url)
    let constants: Constants = await response.json()
    return constants.baseUrl
  },
}
