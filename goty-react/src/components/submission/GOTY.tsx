import React from "react"
import { Game } from "../../models/game"
import { generateRules } from "../../util/generate-rules"
import { indexToWord } from "../../util/index-to-word"
import { Card } from "../Card"
import { OrderableList } from "./shared/OrderableList"
import { Search } from "./shared/Search"

export interface GOTYProps {
  games: Game[]
  year: number
  readonly: boolean
  closeDate: string
  maxListSize: number
  setGames?: (games: Game[]) => void
}

export enum MoveDirection {
  IncreaseRank,
  DecreaseRank,
}

const getRules = (closeDate: string, year: number) => [
  <li key="gotyClose">Voting Closes {closeDate}</li>,
  "You may nominate as many games as you want up to a total of 10. Only the GOTY is required, but I encourage you all to answer the bonus questions!",
  <li key="gotyYear">
    Eligible games must have been released in {year}. Early Access games are
    fine as long as they were released in {year}.{" "}
  </li>,
  "DLC is not eligible",
  "Games will be rated based on number of votes. In the event of a tie points will be awarded based off the ranking in your list. ",
]

// todo externalize
const defaultTiePoints = [15, 13, 11, 7, 6, 5, 4, 3, 2, 1]

const getTieBreaker = () => {
  return (
    <React.Fragment>
      <p>Tie-breaker points are awarded as follows:</p>
      <ul>
        {defaultTiePoints.map((tiePoint, index) => (
          <li key={index}>{`${indexToWord(index)}: ${tiePoint}`}</li>
        ))}
      </ul>
    </React.Fragment>
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
  const setGames = props.setGames
  const canSubmit = (
    setGame?: (games: Game[]) => void
  ): setGame is (games: Game[]) => void => {
    return !props.readonly && props.setGames != null
  }
  const handleAddGame = (gameToAdd: Game) => {
    if (canSubmit(setGames) && props.games.length !== props.maxListSize) {
      setGames([
        ...props.games.filter((game) => game.id !== gameToAdd.id),
        gameToAdd,
      ])
    }
  }
  const handleMoveGame = (currentIndex: number, direction: MoveDirection) => {
    if (
      canSubmit(setGames) &&
      inBounds(currentIndex, direction, props.games.length)
    ) {
      setGames(swap(props.games, currentIndex, direction))
    }
  }

  const handleDeleteGame = (gameToDelete: Game) => {
    if (canSubmit(setGames)) {
      setGames(props.games.filter((game) => game.id !== gameToDelete.id))
    }
  }
  return (
    <Card
      title={`What are your favorite game(s) of ${props.year}?`}
      required={true}
      content={
        <React.Fragment>
          {generateRules(props.readonly, getRules(props.closeDate, props.year))}
          {getTieBreaker()}
          {props.readonly ? null : (
            <Search placeholder="Select a game" handleSelect={handleAddGame} />
          )}
          <OrderableList
            games={props.games}
            readonly={props.readonly}
            handleDelete={handleDeleteGame}
            handleMove={handleMoveGame}
          />
        </React.Fragment>
      }
    />
  )
}
