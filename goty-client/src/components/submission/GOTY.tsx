import React from 'react'
import { useSelector, useStore } from 'react-redux'
import { selectProperties } from '../../state/properties/selectors'
import { createUpdateGamesOfTheYearAction } from '../../state/submission/actions'
import { indexToOrdinal } from '../../util/index-to-ordinal'
import { Card } from '../controls/Card/Card'
import { OrderableList } from './shared/OrderableList'
import { Search } from './shared/Search'
import { Game } from '../../models/game'
import { Rules } from './Rules'

export interface GOTYProps {
  games: Game[]
  readonly: boolean
}

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

export const GOTY = (props: GOTYProps) => {
  const properties = useSelector(selectProperties)
  const store = useStore()
  const setGames = (games: Game[]) =>
    store.dispatch(createUpdateGamesOfTheYearAction(games))
  const handleAddGame = (gameToAdd: Game) => {
    if (!props.readonly && props.games.length !== properties.tiePoints.length) {
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
    <Card title={properties.gotyQuestion.title} required={true}>
      <span>{properties.gotyQuestion.question}</span>
      <Rules readonly={props.readonly} rules={properties.gotyQuestion.rules} />
      {!props.readonly && getTieBreaker(properties.tiePoints)}
      {props.readonly ||
      props.games.length === properties.tiePoints.length ? null : (
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
