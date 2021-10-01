import { Game } from '../models/game'
import { searchResults } from './mockData'

export const GameService = {
  searchGames: (
    input: string,
    limit: number,
    year?: number
  ): Promise<Game[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(searchResults), 250)
    )
  },
}
