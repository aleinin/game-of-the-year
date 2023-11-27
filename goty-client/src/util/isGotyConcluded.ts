export const isGotyConcluded = (deadline: string) =>
  new Date(deadline) <= new Date()
