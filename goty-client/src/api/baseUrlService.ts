import axios from 'axios'

interface Constants {
  baseUrl: string
}

export const baseUrlService = {
  getBaseUrl: (): Promise<string | undefined> => {
    const url = `${window.location.origin}/constants.json`
    return axios
      .get<Constants>(url)
      .then((axiosResponse) => axiosResponse?.data?.baseUrl)
  },
}
