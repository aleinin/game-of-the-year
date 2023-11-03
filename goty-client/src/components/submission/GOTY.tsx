import React from 'react'
import { useSelector, useStore } from 'react-redux'
import { Game } from '../../api/gameService'
import { selectProperties } from '../../state/properties/selectors'
import { createUpdateGamesOfTheYearAction } from '../../state/submission/actions'
import { generateRules } from '../../util/generate-rules'
import { indexToOrdinal } from '../../util/index-to-ordinal'
import { Card } from '../Card'
import { OrderableList } from './shared/OrderableList'
import { Search } from './shared/Search'

export interface GOTYProps {
  games: Game[]
  readonly: boolean
}

export enum MoveDirection {
  IncreaseRank,
  DecreaseRank,
}

const getRules = (closeDate: string, year: number) => [
  <li key="gotyClose">Voting closes {closeDate}</li>,
  'You may nominate as many games as you want up to a total of 10. Only the GOTY is required, but I encourage you all to answer the bonus questions!',
  <li key="gotyYear">
    Eligible games must have been released in {year}. Early Access games are
    fine as long as they were released in {year}.{' '}
  </li>,
  'DLC is not eligible',
  'Games will be rated based on number of votes. In the event of a tie points will be awarded based off the ranking in your list. ',
]

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
  numberOfGamesInList: number
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
  direction: MoveDirection
): Game[] => {
  const moveBy = direction === MoveDirection.DecreaseRank ? 1 : -1
  const newGames = [...games]
  const gameToMove = newGames[index]
  newGames[index] = newGames[index + moveBy]
  newGames[index + moveBy] = gameToMove
  return newGames
}

export const GOTY = (props: GOTYProps) => {
  const properties = useSelector(selectProperties)
  const store = useStore()
  const setGames = (games: Game[]) =>
    store.dispatch(createUpdateGamesOfTheYearAction(games))
  const handleAddGame = (gameToAdd: Game) => {
    if (
      !props.readonly &&
      props.games.length !== properties.maxGamesOfTheYear
    ) {
      setGames([
        ...props.games.filter((game) => game.id !== gameToAdd.id),
        gameToAdd,
      ])
    }
  }
  const handleMoveGame = (currentIndex: number, direction: MoveDirection) => {
    if (
      !props.readonly &&
      inBounds(currentIndex, direction, props.games.length)
    ) {
      setGames(swap(props.games, currentIndex, direction))
    }
  }

  const handleDeleteGame = (gameToDelete: Game) => {
    if (!props.readonly) {
      setGames(props.games.filter((game) => game.id !== gameToDelete.id))
    }
  }
  return (
    <Card
      title={`What are your favorite game(s) of ${properties.year}?`}
      required={true}
    >
      {generateRules(
        props.readonly,
        getRules(properties.deadline, properties.year)
      )}
      {properties.tiePoints ? getTieBreaker(properties.tiePoints) : null}
      {props.readonly ||
      props.games.length === properties.maxGamesOfTheYear ? null : (
        <Search
          year={properties.year}
          placeholder="Select a game"
          handleSelect={handleAddGame}
        />
      )}
      <OrderableList
        games={props.games}
        readonly={props.readonly}
        handleDelete={handleDeleteGame}
        handleMove={handleMoveGame}
      />
    </Card>
  )
}
