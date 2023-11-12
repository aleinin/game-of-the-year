import { Game } from '../models/game'
import fetcher from './fetcher'

export interface SearchGameParams {
  title: string
  limit?: number
  year?: number
}

export const GameService = {
  searchGames: (params: SearchGameParams): Promise<Game[]> => {
    return fetcher.get<Game[]>('/games', {
      params: new URLSearchParams({
        title: params.title,
        ...(params.limit && { limit: params.limit.toString() }),
        ...(params.year && { year: params.year.toString() }),
      }),
    })
  },
}
