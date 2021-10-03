import { searchResults } from './mockData'

export interface Game {
  id: string
  title: string
}

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
