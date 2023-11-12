interface Constants {
  baseUrl?: string
}

export const baseUrlService = {
  getBaseUrl: (): Promise<string | undefined> => {
    const url = `${window.location.origin}/constants.json`
    return fetch(url)
      .then((response) => response.json())
      .then((response: Constants) => response.baseUrl)
  },
}
