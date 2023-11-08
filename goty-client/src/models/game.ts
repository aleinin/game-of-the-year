export interface Game {
  id: string
  title: string
}

export const isEqual = (
  one: Game | null | undefined,
  two: Game | null | undefined,
): boolean => {
  return one?.id === two?.id && one?.title === two?.title
}
