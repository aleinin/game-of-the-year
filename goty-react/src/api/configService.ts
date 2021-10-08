import axios from 'axios'
import { Constants } from '../state/constants/reducer'

export const configService = {
  getConfig: (): Promise<Partial<Constants>> => {
    const url = `${window.location.origin}/constants.json`
    return axios
      .get<Partial<Constants>>(url)
      .then((axiosResponse) => axiosResponse.data)
  },
}
