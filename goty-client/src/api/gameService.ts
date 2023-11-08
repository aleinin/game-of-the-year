import axios from 'axios'
import { Game } from '../models/game'

export interface SearchGameParams {
  title: string
  limit?: number
  year?: number
}

export const GameService = {
  searchGames: (params: SearchGameParams): Promise<Game[]> => {
    return axios
      .get<Game[]>('/games', {
        params,
      })
      .then((response) => response.data)
  },
}
