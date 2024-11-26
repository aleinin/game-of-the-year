import { indexToOrdinal } from '../../util/indexToOrdinal'
import { Card } from '../controls/Card/Card'
import { Game } from '../../models/game'
import { Rules } from './Rules'
import { Search } from '../controls/Search/Search'
import { OrderedList } from '../controls/OrderedList'
import { InputStateKeyContext } from './useSubmissionForm'
import { Properties } from '../../models/properties'

export enum MoveDirection {
  IncreaseRank,
  DecreaseRank,
}

const getTieBreaker = (tiePoints: number[]) => {
  return (
    <>
      <p>Tie-breaker points are awarded as follows:</p>
      <ul>
        {tiePoints.map((tiePoint, index) => (
          <li key={index}>{`${indexToOrdinal(index)}: ${tiePoint}`}</li>
        ))}
      </ul>
    </>
  )
}

const inBounds = (
  index: number,
  direction: MoveDirection,
  numberOfGamesInList: number,
) => {
  return (
    (direction === MoveDirection.IncreaseRank && index > 0) ||
    (direction === MoveDirection.DecreaseRank &&
      index < numberOfGamesInList - 1)
  )
}

const swap = (
  games: Game[],
  index: number,
  direction: MoveDirection,
): Game[] => {
  const moveBy = direction === MoveDirection.DecreaseRank ? 1 : -1
  const newGames = [...games]
  const gameToMove = newGames[index]
  newGames[index] = newGames[index + moveBy]
  newGames[index + moveBy] = gameToMove
  return newGames
}

export interface GOTYProps {
  games: Game[]
  readonly: boolean
  handleSetGames?: (games: Game[]) => void
  properties: Properties
}

export const GOTY = ({
  games,
  handleSetGames,
  readonly,
  properties,
}: GOTYProps) => {
  const setGames = (games: Game[]) => handleSetGames && handleSetGames(games)
  const handleAddGame = (gameToAdd: Game) => {
    if (!readonly && games.length !== properties.tiePoints.length) {
      setGames([...games.filter((game) => game.id !== gameToAdd.id), gameToAdd])
    }
  }
  const handleMoveGame = (currentIndex: number, direction: MoveDirection) => {
    if (!readonly && inBounds(currentIndex, direction, games.length)) {
      setGames(swap(games, currentIndex, direction))
    }
  }

  const handleDeleteGame = (gameToDelete: Game) => {
    if (!readonly) {
      setGames(games.filter((game) => game.id !== gameToDelete.id))
    }
  }
  return (
    <Card title={properties.gotyQuestion.title} required={!readonly}>
      <span>{properties.gotyQuestion.question}</span>
      <Rules readonly={readonly} rules={properties.gotyQuestion.rules} />
      {!readonly && getTieBreaker(properties.tiePoints)}
      {readonly || games.length === properties.tiePoints.length ? null : (
        <InputStateKeyContext.Provider value={'goty'}>
          <Search
            searchYears={properties.searchYears}
            placeholder="Select games of the year"
            handleSelect={handleAddGame}
          />
        </InputStateKeyContext.Provider>
      )}
      <OrderedList
        games={games}
        readonly={readonly}
        handleDelete={handleDeleteGame}
        handleMove={handleMoveGame}
      />
    </Card>
  )
}
